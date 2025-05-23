using AutoMapper;
using LLM.StudyZone.Books;

namespace LLM.StudyZone;

public class StudyZoneApplicationAutoMapperProfile : Profile
{
    public StudyZoneApplicationAutoMapperProfile()
    {
        CreateMap<Book, BookDto>();
        CreateMap<CreateUpdateBookDto, Book>();
        /* You can configure your AutoMapper mapping configuration here.
         * Alternatively, you can split your mapping configurations
         * into multiple profile classes for a better organization. */
    }
}
