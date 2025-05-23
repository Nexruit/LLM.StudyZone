using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;
using Microsoft.Extensions.Localization;
using LLM.StudyZone.Localization;

namespace LLM.StudyZone.Web.Public;

[Dependency(ReplaceServices = true)]
public class StudyZoneBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<StudyZoneResource> _localizer;

    public StudyZoneBrandingProvider(IStringLocalizer<StudyZoneResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
