using LLM.StudyZone.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace LLM.StudyZone.Permissions;

public class StudyZonePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(StudyZonePermissions.GroupName);

        myGroup.AddPermission(StudyZonePermissions.Dashboard.Host, L("Permission:Dashboard"), MultiTenancySides.Host);
        myGroup.AddPermission(StudyZonePermissions.Dashboard.Tenant, L("Permission:Dashboard"), MultiTenancySides.Tenant);

        var booksPermission = myGroup.AddPermission(StudyZonePermissions.Books.Default, L("Permission:Books"));
        booksPermission.AddChild(StudyZonePermissions.Books.Create, L("Permission:Books.Create"));
        booksPermission.AddChild(StudyZonePermissions.Books.Edit, L("Permission:Books.Edit"));
        booksPermission.AddChild(StudyZonePermissions.Books.Delete, L("Permission:Books.Delete"));
        //Define your own permissions here. Example:
        //myGroup.AddPermission(StudyZonePermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<StudyZoneResource>(name);
    }
}
