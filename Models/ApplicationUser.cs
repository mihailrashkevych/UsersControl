using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UsersControl.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public DateTime RegisteringDate { get; set; }
        public DateTime LastSigningDate { get; set; }
        public string Status { get; set; }
        public bool IsChecked { get; set; } = false;
    }
}
