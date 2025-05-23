using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;

namespace LLM.StudyZone.Web.Public.Pages;

public class IndexModel : StudyZonePublicPageModel
{
    public void OnGet()
    {

    }

    public async Task OnPostLoginAsync()
    {
        await HttpContext.ChallengeAsync("oidc");
    }
}
