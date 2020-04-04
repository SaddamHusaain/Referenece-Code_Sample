using Test.Core.DTOs.Request;
using Test.Core.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Test.Repository.IRepository
{
    public interface ICommonRepository
    {
        Task<BaseResponse> SaveUpdateEntity(SaveRequest request);
        event Test.Repository.Repository.CommonRepository.PostSaveEventHandler PostSaved;
    }
}
