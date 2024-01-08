using EPPlus.Core.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using static OfficeOpenXml.ExcelErrorValue;
using System.Composition;

namespace ticket_api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ExcelProcessor : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Work([FromForm] IFormFile file)
    {
        var dd = new List<UploadExcelDTO>();
        if (file is null)
        {
            file = Request.Form.Files.FirstOrDefault();
            if (file is null)
            {
                return BadRequest(new
                {
                    message = "No file was uploaded!"
                });
            }
        }

        try
        {
            using var stream = file.OpenReadStream();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage(stream);

            var data = package.ToList<UploadExcelDTO>(0);
            var dict = new Dictionary<string, string>();
            var seq = 1;

            foreach (var datum in data)
            {
                if (datum?.PhoneNo is null) continue;

                var i = new UploadExcelDTO
                {
                    OwnerName = datum.OwnerName,
                    PhoneNo= datum.PhoneNo,
                };

                if (dict.ContainsKey(datum?.PhoneNo))
                {
                    i.OwnerID = dict[datum?.PhoneNo];
                }
                else
                {
                    dict.Add(datum?.PhoneNo, $"{seq:000000000000}");
                    i.OwnerID = $"{seq:000000000000}";
                    seq++;
                }

                dd.Add(i);
            }

            var x = dd.ToExcelPackage();

            await x.SaveAsAsync(new FileInfo("newFile.xlsx"), CancellationToken.None);

            return Ok("Done");
        }
        catch (Exception e)
        {
            return new BadRequestObjectResult(new { message = e.Message });
            throw;
        }

    }
}
