using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using Test.Core.DTOs.Request;
using Test.Core.DTOs.Response;
using Test.Core.DTOs.Response.Common;
using Test.Core.Shared.Helper;
using Test.Core.Shared.Static;
using Test.Data.DBContext;
using Test.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Test.Repository.Repository
{

    public class CommonRepository : ICommonRepository
    {
       public TestDBContext _ObjContext;

        #region Object Variables
        private BaseResponse _response;
        public List<EntriesState> entriesStates = null;
        #endregion

        public CommonRepository(TestDBContext ObjContext)
        {
            _ObjContext = ObjContext;
        }

        #region Delegates
        //Define a delegate
        public delegate PostSaveResponse PostSaveEventHandler(object source, PostSaveEventArgs args);


        //Define event based on that delefate
        public event PostSaveEventHandler PostSaved;
        #endregion
        public async Task<BaseResponse> SaveUpdateEntity(SaveRequest request)
        {
            string entityPath = CommonFunction.GetEntityPath(request.EntityName);
            Type type = CommonFunction.GetType(entityPath);
            foreach (object obj in request.Data)
            {
                var entity = JsonConvert.DeserializeObject(obj.ToString(), type);
                _ObjContext.Update(entity);
            }
            PreSaveUpdates(_ObjContext.ChangeTracker.Entries(), request);
            int result = await _ObjContext.SaveChangesAsync();
            if (result > 0)
            {
                OnPostSaved(request, _ObjContext.ChangeTracker.Entries());
            }
            return _response;
        }

        private void PreSaveUpdates(IEnumerable<EntityEntry> entries, SaveRequest request)
        {
            entriesStates = new List<EntriesState>();
            // List of all Entites that are changed.
            foreach (var entry in entries)
            {
                //Console.WriteLine($"Entity: {entry.Entity.GetType().Name},State: { entry.State.ToString()}");
                var entityName = entry.Entity.GetType().Name;

                if (entry.State.ToString() == "Added")
                {
                    entry.Property(BaseEntityConstant.CREATEBY).CurrentValue = request.AdditionalFields.UserName;
                    entry.Property(BaseEntityConstant.CREATEDATE).CurrentValue = DateTime.Now;
                    entry.Property(BaseEntityConstant.MODIFIEDDATE).CurrentValue = DateTime.Now;
                    entriesStates.Add(new EntriesState { EntityName = entry.Entity.GetType().Name.ToString(), EntityState = entry.State.ToString() });
                }
                else if (entry.State.ToString() == "Modified")
                {
                    var databaseValues = entry.GetDatabaseValues();
                    if (entry.CurrentValues[BaseEntityConstant.RECORDDELETED] != null && entry.CurrentValues[BaseEntityConstant.RECORDDELETED] != databaseValues[BaseEntityConstant.RECORDDELETED])
                    {
                        databaseValues[BaseEntityConstant.RECORDDELETED] = entry.CurrentValues[BaseEntityConstant.RECORDDELETED];
                        entry.CurrentValues.SetValues(databaseValues);
                    }
                    // loop through all property that are modified
                    foreach (var prop in entry.OriginalValues.Properties)
                    {
                        //var originalValue = databaseValues[prop.Name] != null ? databaseValues[prop.Name].ToString() : null;
                        //var currentValue = entry.CurrentValues[prop.Name] != null ? entry.CurrentValues[prop.Name].ToString() : null;            
                        switch (prop.Name)
                        {
                            case BaseEntityConstant.CREATEBY:
                            case BaseEntityConstant.CREATEDATE:
                                entry.CurrentValues[prop.Name] = databaseValues[prop.Name];
                                break;
                            case BaseEntityConstant.ACTIVE:
                                if (entry.CurrentValues[BaseEntityConstant.ACTIVE] == null)
                                {
                                    entry.CurrentValues[prop.Name] = databaseValues[prop.Name];
                                }
                                break;
                            case BaseEntityConstant.RECORDDELETED:
                                if (entry.CurrentValues[BaseEntityConstant.RECORDDELETED] != null && entry.CurrentValues[BaseEntityConstant.RECORDDELETED].ToString() == "Y")
                                {
                                    entry.CurrentValues[BaseEntityConstant.RECORDDELETED] = "Y";
                                    entry.CurrentValues[BaseEntityConstant.DELETEDBY] = request.AdditionalFields.UserName;
                                    entry.CurrentValues[BaseEntityConstant.DELETEDDATE] = DateTime.Now;
                                    entry.CurrentValues[BaseEntityConstant.MODIFIEDBY] = databaseValues[BaseEntityConstant.MODIFIEDBY];
                                    entry.CurrentValues[BaseEntityConstant.MODIFIEDDATE] = databaseValues[BaseEntityConstant.MODIFIEDDATE];
                                }
                                else
                                {
                                    entry.CurrentValues[BaseEntityConstant.RECORDDELETED] = "N";
                                    entry.CurrentValues[BaseEntityConstant.DELETEDBY] = null;
                                    entry.CurrentValues[BaseEntityConstant.DELETEDDATE] = null;
                                    entry.CurrentValues[BaseEntityConstant.MODIFIEDBY] = request.AdditionalFields.UserName;
                                    entry.CurrentValues[BaseEntityConstant.MODIFIEDDATE] = DateTime.Now;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    entriesStates.Add(new EntriesState { EntityName = entry.Entity.GetType().Name.ToString(), EntityState = entry.State.ToString() });
                }
            }
        }

        #region Pre save Event
        protected virtual PostSaveResponse OnPostSaved(SaveRequest saveRequest, IEnumerable<EntityEntry> modifiedEntities)
        {
            var PostSaveResponse = new PostSaveResponse();
            if (PostSaved != null)
                PostSaved(this, new PostSaveEventArgs() { SaveRequest = saveRequest, ModifiedEntities = modifiedEntities.Where(x => x.Metadata.ClrType.Name != "Apilogs") });
            return PostSaveResponse;
        }

        #endregion
    }
}
