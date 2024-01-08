using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Linq.Expressions;

namespace ticket_api.Helpers.GetRequestHandler;

public static class QueryableExtensions
{
    public static async Task<PaginatedResult<T>> PaginateAsync<T>(this IQueryable<T> source, RequestParams requestParams, CancellationToken token = default)
    {
        source = source.Filter(requestParams.Filters)
            .Sort(requestParams.Sorts);

        var totalItems = await source.CountAsync(token);

        // Order every table in a descending order based on the createdAt collumn.
        var properties = typeof(T).GetProperties().Select(t => t.Name);
        if (properties.Contains(nameof(BaseEntity.CreatedAt)))
        {
            source = source.OrderByDescending(s => EF.Property<T>(s!, nameof(BaseEntity.CreatedAt)));
        }

        if (requestParams.Size > 0)
            source = source.Skip(requestParams.Page * requestParams.Size)
                .Take(requestParams.Size);

        var items = await source.ToListAsync(token);

        return new PaginatedResult<T>()
        {
            Page = requestParams.Page,
            Size = requestParams.Size,
            Items = items,
            TotalItems = totalItems,
            TotalPages = requestParams.Size > 0 ? (int)Math.Floor((decimal)totalItems / requestParams.Size) : 1
        };
    }

    public static IQueryable<T> Filter<T>(this IQueryable<T> source, List<Filter> filters)
    {
        if (!filters.Any())
        {
            return source;
        }

        foreach (var filter in filters)
        {
            var param = Expression.Parameter(typeof(T), "x");

            var propertyAccess = Expression.Property(param, filter.Field);

            var converter = TypeDescriptor.GetConverter(propertyAccess.Type);

            var tempValue = converter.ConvertFromInvariantString(filter.Value.ToString());

            //var value = Expression.Constant(tempValue, tempValue.GetType());
            var value = Expression.Constant(tempValue, propertyAccess.Type);

            var operation = filter.Operation switch
            {
                Operation.Eq => Expression.Equal(propertyAccess, value),
                Operation.Gt => Expression.GreaterThan(propertyAccess, value),
                Operation.Lt => Expression.LessThan(propertyAccess, value),
                Operation.Gte => Expression.GreaterThanOrEqual(propertyAccess, value),
                Operation.Lte => Expression.LessThanOrEqual(propertyAccess, value),
                Operation.Like => GetLikeOperation(propertyAccess, filter.Value?.ToString()?.ToLower() ?? ""),
                //Operation.In => GetLikeOperation(propertyAccess, filter.Value?.ToString()?.ToLower() ?? ""),
                _ => Expression.Equal(propertyAccess, value)
            };

            var lambda = Expression.Lambda<Func<T, bool>>(operation, param);

            source = source.Where(lambda);
        }

        return source;

        static Expression GetLikeOperation(MemberExpression propertyAccess, string value)
        {
            var like = typeof(DbFunctionsExtensions)
                    .GetMethod(nameof(DbFunctionsExtensions.Like), new[] { typeof(DbFunctions), typeof(string), typeof(string) });
            var toLower = typeof(string).GetMethod(nameof(string.ToLower), Type.EmptyTypes);

            var filterValue = Expression.Constant($"%{value}%", typeof(string));

            var toLowerExpression = Expression.Call(propertyAccess, toLower);
            return Expression.Call(like, Expression.Constant(EF.Functions), toLowerExpression, filterValue);
        } 

        //static Expression GetInOperation(MemberExpression propertyAccess, string value)
        //{
        //    var contains = typeof(SqlServerDbFunctionsExtensions)
        //            .GetMethod(nameof(SqlServerDbFunctionsExtensions.Contains), new[] { typeof(DbFunctions), typeof(string), typeof(string) });
        //    var toLower = typeof(string).GetMethod(nameof(string.ToLower), Type.EmptyTypes);


        //    var filterValue = Expression.Constant($"%{value}%", typeof(string));

        //    var toLowerExpression = Expression.Call(propertyAccess, toLower);
        //    return Expression.Call(contains, Expression.Constant(EF.Functions), toLowerExpression, filterValue);
        //}
    }

    public static IQueryable<T> Sort<T>(this IQueryable<T> source, List<Sort> sorts)
    {
        if (!sorts.Any())
        {
            return source;
        }

        var i = 0;
        foreach (var sort in sorts)
        {
            var param = Expression.Parameter(typeof(T), "x");

            var propertyAccess = Expression.Property(param, sort.Field);

            var fieldType = propertyAccess.Type;

            var lambda = Expression.Lambda(propertyAccess, param);
            var direction = "";
            if (i is 0)
            {
                direction = sort.IsAscending ? nameof(Queryable.OrderBy) : nameof(Queryable.OrderByDescending);
            }
            else
            {
                direction = sort.IsAscending ? nameof(Queryable.ThenBy) : nameof(Queryable.ThenByDescending);
            }

            var call = Expression.Call(typeof(Queryable), direction, new[] { source.ElementType, propertyAccess.Type },
                source.Expression, lambda);

            source = source.Provider.CreateQuery<T>(call);
            i++;
        }

        return source;
    }
}

