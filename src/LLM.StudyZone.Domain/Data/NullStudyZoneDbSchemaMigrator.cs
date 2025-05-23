using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace LLM.StudyZone.Data;

/* This is used if database provider does't define
 * IStudyZoneDbSchemaMigrator implementation.
 */
public class NullStudyZoneDbSchemaMigrator : IStudyZoneDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
