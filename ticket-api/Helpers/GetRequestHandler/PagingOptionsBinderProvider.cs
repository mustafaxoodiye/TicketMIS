using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ticket_api.Helpers.GetRequestHandler;

public class PagingOptionsBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        if (context is null)
        {
            return null;
        }

        if (context.Metadata.ModelType == typeof(RequestParams))
        {
            return new BinderTypeModelBinder(typeof(PagingOptionsBinder));
        }

        return null;
    }
}
