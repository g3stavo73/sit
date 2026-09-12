using Microsoft.AspNetCore.Mvc;
using CalculatorApp.Models;

namespace CalculatorApp.Controllers;

public class HomeController : Controller
{
    private static readonly List<CalculationItem> History = new();

    public IActionResult Index()
    {
        return View(History.OrderByDescending(h => h.FormattedTime).Take(10).ToList());
    }

    [HttpPost]
    public IActionResult Calculate([FromBody] CalculationRequest req)
    {
        if (req == null) return BadRequest(new { message = "Dados inválidos." });

        double res = 0;
        switch (req.Operation)
        {
            case "+": res = req.Number1 + req.Number2; break;
            case "-": res = req.Number1 - req.Number2; break;
            case "*": res = req.Number1 * req.Number2; break;
            case "/":
                if (req.Number2 == 0) return BadRequest(new { message = "Divisão por zero não é permitida." });
                res = req.Number1 / req.Number2;
                break;
            default: return BadRequest(new { message = "Operação inválida." });
        }

        var item = new CalculationItem
        {
            Number1 = req.Number1,
            Number2 = req.Number2,
            Operation = req.Operation,
            Result = res,
            FormattedTime = DateTime.Now.ToString("HH:mm:ss")
        };

        History.Add(item);

        return Json(new { success = true, result = res, history = History.OrderByDescending(h => h.FormattedTime).Take(10) });
    }

    [HttpPost]
    public IActionResult ClearHistory()
    {
        History.Clear();
        return Json(new { success = true });
    }
} 
