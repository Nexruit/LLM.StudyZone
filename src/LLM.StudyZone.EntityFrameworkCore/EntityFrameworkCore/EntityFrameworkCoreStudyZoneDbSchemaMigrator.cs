using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using LLM.StudyZone.Data;
using Volo.Abp.DependencyInjection;

namespace LLM.StudyZone.EntityFrameworkCore;

public class EntityFrameworkCoreStudyZoneDbSchemaMigrator
    : IStudyZoneDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreStudyZoneDbSchemaMigrator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolving the StudyZoneDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<StudyZoneDbContext>()
            .Database
            .MigrateAsync();
    }
}
