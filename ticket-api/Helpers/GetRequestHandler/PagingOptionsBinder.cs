using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ticket_api.Helpers.GetRequestHandler;


public class PagingOptionsBinder : IModelBinder
{
    public async Task BindModelAsync(ModelBindingContext bindingContext)
    {
        await Task.CompletedTask;

        if (bindingContext is null)
        {
            return;
        }

        var requestParams = new RequestParams();

        var query = bindingContext.HttpContext.Request.Query;

        if (int.TryParse(query["page"], out var page))
        {
            requestParams.Page = page;
        }

        if (int.TryParse(query["size"], out var size))
        {
            requestParams.Size = size;
        }

        if (query.ContainsKey("sort"))
        {
            var sorts = query["sort"];

            foreach (var sort in sorts)
            {
                var splitSort = sort.Split('.', StringSplitOptions.RemoveEmptyEntries);

                var isAscending = true;

                if (splitSort.Length > 1 && splitSort[1].Equals("false", StringComparison.OrdinalIgnoreCase)) { isAscending = false; };

                requestParams.Sorts.Add(new()
                {
                    Field = splitSort[0],
                    IsAscending = isAscending,
                });
            }
        }

        var filters = query.Where(q => q.Key is not "page" and not "size" and not "sort" and not "select");
        foreach (var filter in filters)
        {
            if (!filter.Key.Contains("."))
            {
                continue;
            }
            var filterParts = filter.Key.Split('.', StringSplitOptions.RemoveEmptyEntries);

            var operation = Operation.Eq;

            _ = filterParts.Length > 1 && Enum.TryParse(filterParts[1], true, out operation);

            requestParams.Filters.Add(new()
            {
                Field = filterParts[0],
                Operation = operation,
                Value = filter.Value,
            });
        }

        bindingContext.Result = ModelBindingResult.Success(requestParams);
    }
}
