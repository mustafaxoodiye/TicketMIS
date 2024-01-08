namespace ticket_api.Helpers;
public static class StringExtensions
{
    public static string Capitalize(this string input)
        => input[0..1].ToUpperInvariant() + input[1..].ToLowerInvariant();

    public static string ToCamelCase(this string str)
    {
        if (!string.IsNullOrEmpty(str) && str.Length > 1)
        {
            return char.ToLowerInvariant(str[0]) + str.Substring(1);
        }
        return str;
    }

    public static string CapitalizeFirst(this string input)
    {
       return char.ToUpper(input[0]) + input[1..]; // captalizes first letter
    }
}
