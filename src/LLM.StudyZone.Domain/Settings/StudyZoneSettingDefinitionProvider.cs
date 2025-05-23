using Volo.Abp.Settings;

namespace LLM.StudyZone.Settings;

public class StudyZoneSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(StudyZoneSettings.MySetting1));
    }
}
