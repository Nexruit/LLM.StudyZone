using LLM.StudyZone.Localization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace LLM.StudyZone.Web.Public.Pages;

/* Inherit your Page Model classes from this class.
 */
public abstract class StudyZonePublicPageModel : AbpPageModel
{
    protected StudyZonePublicPageModel()
    {
        LocalizationResourceType = typeof(StudyZoneResource);
    }
}
