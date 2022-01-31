using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Locations;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/locations")]
    [ApiController]
    public class LocationApiController : BaseApiController
    {
        private ILocationService _service = null;
        private IAuthenticationService<int> _authService = null;

        public LocationApiController(ILocationService service
             , ILogger<LocationApiController> logger
             , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(LocationAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("getByUserId")]
        public ActionResult<ItemsResponse<Location>> GetByUserId(int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Location> paged = _service.GetLocationsByUserId(userId, pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Location>> response = new ItemResponse<Paged<Location>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(LocationUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpDelete("{id}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Location>>> Pagination(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Location> paged = _service.Pagination(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Location>> response = new ItemResponse<Paged<Location>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("country/{countryId}")]
        public ActionResult<ItemsResponse<State>> GetStatesByCountryId(int countryId)
        {
            int icode = 200;
            BaseResponse response = null;
            try
            {
                List<State> states = _service.GetStatesByCountryId(countryId);

                if (states == null)
                {
                    icode = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemsResponse<State> { Items = states };
                }
            }
            catch (Exception ex)
            {
                icode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ ex.Message}");
            }

            return StatusCode(icode, response);
        }

        [HttpGet("locationTypes")]
        public ActionResult<ItemsResponse<LocationTypes>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<LocationTypes> list = _service.GetLocationTypes();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resourse not found.");
                }
                else
                {
                    response = new ItemsResponse<LocationTypes> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

    }
}
