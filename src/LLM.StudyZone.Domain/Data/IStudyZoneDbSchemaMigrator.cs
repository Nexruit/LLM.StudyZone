using System.Threading.Tasks;

namespace LLM.StudyZone.Data;

public interface IStudyZoneDbSchemaMigrator
{
    Task MigrateAsync();
}
