using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Locations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface ILocationService
    {
        int Add(LocationAddRequest model, int userId);

        Location Get(int id);

        Paged<Location> GetLocationsByUserId(int userId, int pageIndex = 0, int pageSize = 100);

        void Update(LocationUpdateRequest model, int userId);

        void Delete(int id);

        Paged<Location> Pagination(int pageIndex, int pageSize);

        List<State> GetStatesByCountryId(int countryId);

        List<LocationTypes> GetLocationTypes();

    }
}
