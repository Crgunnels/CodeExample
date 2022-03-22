using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Sabio.Models.Requests.Locations
{
    public class LocationAddRequest
    {
        [Required]
        [Range(minimum: 1, maximum: Int32.MaxValue)]
        public int LocationTypeId { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string LineOne { get; set; }

        public string LineTwo { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string City { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string Zip { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string State { get; set; }

        [Required]
        [Range(minimum:-90, maximum: 90)]
        public double Latitude { get; set; }

        [Required]
        [Range(minimum: -180, maximum: 180)]
        public double Longitude { get; set; }

    }
}
