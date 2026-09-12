namespace CalculatorApp.Models;

public class CalculationRequest
{
    public double Number1 { get; set; }
    public double Number2 { get; set; }
    public string Operation { get; set; } = string.Empty;
}

public class CalculationItem
{
    public double Number1 { get; set; }
    public double Number2 { get; set; }
    public string Operation { get; set; } = string.Empty;
    public double Result { get; set; }
    public string FormattedTime { get; set; } = string.Empty;
} 
