
export class DateHelpers {


  public static setInputDate(date?: string | null) {
    if (!date) return '';

    return new Date(date.substring(0, 10)).toISOString().substring(0, 10);
  }

  /**
   * E.g. Jan/2021
   */
  public static getShortMonthYear(date?: Date) {
    date = date ?? new Date();
    const shortMonth = date.toLocaleString("en-us", { month: "short" });

    return shortMonth + "/" + date.getFullYear();
  }

  /**
   * E.g. Jan/2021
   */
  public static convertToShortMonthYear(date: string) {
    const val = new Date(date);
    const shortMonth = val.toLocaleString("en-us", { month: "short" });

    return shortMonth + "/" + val.getFullYear();
  }

  /**
   * E.g. Jan-2021
   */
  public static getShortMonthYearURLFriendly() {
    const date = new Date();
    const shortMonth = date.toLocaleString("en-us", { month: "short" });

    return shortMonth + "-" + date.getFullYear();
  }

  /**
  * Changes E.g. Jan-2021 to E.g. Jan/2021
  */
  public static ShortMonthYearFormatter(forMonth: string) {
    const str = forMonth.replace("-", "/");
    return str;
  }

  /**
   * E.g. 01/20/2021 - MM/dd/yyyy
   */
  public static getDate() {
    const date = new Date();
    return (
      (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
    );
  }

  public static dateDiffDays(lhs: Date, rhs: Date) {
    const oneDayInMS = 24 * 60 * 60 * 1000;
    const result = Math.abs(lhs.getTime() - rhs.getTime());

    return Math.round(result / oneDayInMS);
  }


  private static generateDate(date: Date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();

    return ({ dd, mm, yyyy })
  }

  /**
   * E.g. 01/20/2021 - dd/MM/yyyy
   */
  public static forwardSlashedDate(date?: Date | string) {
    if (typeof (date) === 'string') date = new Date(date)

    date = date ?? new Date();

    const getDate = this.generateDate(date)

    const formattedDate = getDate.mm + "/" + getDate.dd + "/" + getDate.yyyy;

    return (
      formattedDate
    );
  }

  /**
   * E.g. 2021-05-19 yyyy-mm-dd
   */
  public static dashedDate(date?: Date) {
    date = date ?? new Date();

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();

    const formattedDate = yyyy + '-' + mm + '-' + dd;

    return (
      formattedDate
    );
  }

  public static convertForMonth(forMonth: string) {
    const date = new Date(forMonth);

    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();

    return yyyy + '-' + mm;
  }
}
