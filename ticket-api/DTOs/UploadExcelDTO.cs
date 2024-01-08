using EPPlus.Core.Extensions.Attributes;

namespace ticket_api.DTOs;

public class UploadExcelDTO
{
    [ExcelTableColumnAttribute]
    public string? OwnerID { get; set; }
    [ExcelTableColumnAttribute]
    public string? OwnerName { get; set; }
    [ExcelTableColumnAttribute]
    public string? PhoneNo { get; set; }
}
