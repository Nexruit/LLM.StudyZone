using Microsoft.Extensions.Localization;
using LLM.StudyZone.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace LLM.StudyZone;

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
