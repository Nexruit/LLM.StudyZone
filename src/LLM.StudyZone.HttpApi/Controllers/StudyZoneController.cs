using LLM.StudyZone.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace LLM.StudyZone.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class StudyZoneController : AbpControllerBase
{
    protected StudyZoneController()
    {
        LocalizationResource = typeof(StudyZoneResource);
    }
}
