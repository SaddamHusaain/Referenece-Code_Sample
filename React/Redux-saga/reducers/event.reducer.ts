import IEvent, {
  IEventGraphQL,
  EventTypeEnum,
  EventAgeEnum,
  EventProcessAsEnum,
  SendQRCodeEnum,
} from "@test/models/.dist/interfaces/IEvent";
import {
  EventActionTypes,
  EventActionCreatorTypes,
  // Active Ids
  SetEventIdAction,
  SetTicketTypeIdAction,
  SetUpgradeTypeIdAction,
  SetPromotionIdAction,
  SetCustomFieldIdAction,
  // Create Event
  CreateEventRequestAction,
  CreateEventSuccessAction,
  CreateEventFailureAction,
  // Update Event
  UpdateEventRequestAction,
  UpdateEventSuccessAction,
  UpdateEventFailureAction,
  // Publish Event
  PublishEventAction,
  PublishEventRequestAction,
  PublishEventSuccessAction,
  PublishEventFailureAction,
  // Cache Events
  CacheEventsAction,
  // Event Fields
  SetEventTypeAction,
  SetEventNameAction,
  SetEventSubtitleAction,
  SetEventDescriptionAction,
  SetEventPosterImageUrlAction,
  SetEventVenueIdAction,
  SetEventSeatingChartFieldsAction,
  SetEventSeatingChartKeyAction,
  ClearEventSeatingChartFieldsAction,
  SetEventAgeAction,
  SetEventTaxDeductionAction,
  SetEventUserAgreementAction,
  SetEventProcessAsAction,
  SetEventSendQRCodeAction,
  SetEventSalesBeginImmediatelyAction,
  SetEventScheduleAnnounceAtAction,
  SetEventScheduleTicketsAtAction,
  SetEventScheduleTicketsEndAtAction,
  SetEventScheduleStartsAtAction,
  SetEventScheduleEndsAtAction,
  // Performance Fields
  AddPerformanceHeadliningArtistAction,
  RemovePerformanceHeadliningArtistAction,
  AddPerformanceOpeningArtistAction,
  RemovePerformanceOpeningArtistAction,
  SetPerformanceSongLinkAction,
  SetPerformanceVideoLinkAction,
  SetPerformanceScheduleDoorsAtAction,
  SetPerformanceScheduleStartsAtAction,
  //Ticket Type
  SetTicketTypeAction,
  AddTicketTypeAction,
  SetTicketTypeValuesAction,
  RemoveTicketTypeAction,
  SetTicketTypeVisibleAction,
  MoveTicketTypeUpAction,
  MoveTicketTypeDownAction,
  SetTicketTypeNameAction,
  SetTicketTypeQtyAction,
  SetTicketTypePurchaseLimitAction,
  SetTicketTypeDescriptionAction,
  // Ticket Type Tier
  SetTicketTypeTierAction,
  SetIsUsingPricingTiersAction,
  SetTicketTypeTierEndsAtAction,
  AddTicketTypeTierAction,
  RemoveTicketTypeTierAction,
  // Upgrade Type
  SetUpgradeTypeAction,
  AddUpgradeTypeAction,
  RemoveUpgradeTypeAction,
  SetUpgradeTypeVisibleAction,
  MoveUpgradeTypeUpAction,
  MoveUpgradeTypeDownAction,
  AddUpgradeTypeTicketTypeIdAction,
  RemoveUpgradeTypeTicketTypeIdAction,
  // Promotion
  SetPromotionAction,
  AddPromotionAction,
  RemovePromotionAction,
  SetPromotionActiveAction,
  MovePromotionUpAction,
  MovePromotionDownAction,
  AddPromotionTicketTypeIdAction,
  RemovePromotionTicketTypeIdAction,
  // Custom Field
  SetCustomFieldAction,
  AddCustomFieldAction,
  RemoveCustomFieldAction,
  SetCustomFieldActiveAction,
  MoveCustomFieldUpAction,
  MoveCustomFieldDownAction,
  AddCustomFieldOptionAction,
  RemoveCustomFieldOptionAction,
  SetCustomFieldOptionAction,
  // Delete Event
  DeleteEventSuccessAction,
} from "../actions/event.actions";
import UrlParams from "../../models/interfaces/UrlParams";
import eventState, {
  ticketTypeState,
  ticketTierState,
  upgradeState,
  eventPromotionState,
  eventCustomFieldState,
} from "../../models/states/event.state";
import * as UrlUtil from "@test/utils/.dist/UrlUtil";
import * as ReduxUtil from "@test/utils/.dist/ReduxUtil";
import * as Time from "@test/utils/.dist/time";
import EventUtil from "@test/models/.dist/utils/EventUtil";
import shortid from "shortid";
import IEventSchedule from "@test/models/.dist/interfaces/IEventSchedule";
import IPerformance, {
  IPerformanceSchedule,
} from "@test/models/.dist/interfaces/IPerformance";
import ITicketType from "@test/models/.dist/interfaces/ITicketType";
import ITicketTier from "@test/models/.dist/interfaces/ITicketTier";
import IEventUpgrade from "@test/models/.dist/interfaces/IEventUpgrade";
import IEventPromotion from "@test/models/.dist/interfaces/IEventPromotion";
import IEventCustomField from "@test/models/.dist/interfaces/IEventCustomField";
import IEventQuery from "@test/models/.dist/interfaces/IEventQuery";

export const NEW_EVENT_ID: string = "new";

export interface IEventCache {
  [eventId: string]: IEventGraphQL;
}

export type EventReducerState = {
  eventId: string;
  eventsCache: IEventCache;
  ticketTypeId: string;
  upgradeTypeId: string;
  promotionId: string;
  customFieldId: string;
  salesBeginImmediately: boolean;
  isUsingPricingTiers: boolean;
  saving: boolean;
  publishing: boolean;
  errorMsg: string;
};

function eventReducerState(): EventReducerState {
  const { query } = UrlUtil.parse(window.location.toString());
  const {
    eventId = "",
    ticketTypeId = "",
    upgradeTypeId = "",
    promotionId = "",
    customFieldId = "",
  }: UrlParams = query;

  return {
    eventId,
    eventsCache: {
      [NEW_EVENT_ID]: eventState(),
    },
    ticketTypeId,
    upgradeTypeId,
    promotionId,
    customFieldId,
    salesBeginImmediately: false,
    isUsingPricingTiers: false,
    saving: false,
    publishing: false,
    errorMsg: "",
  };
}

export default function reducer(
  state = eventReducerState(),
  action: EventActionCreatorTypes
) {
  const { type, payload } = action;

  switch (type) {
    /********************************************************************************
     *  General Event Reducers
     *******************************************************************************/

    case EventActionTypes.SET_EVENT_ID:
      return setEventId(state, payload as SetEventIdAction["payload"]);

    case EventActionTypes.SET_TICKET_TYPE_ID:
      return setTicketTypeId(
        state,
        payload as SetTicketTypeIdAction["payload"]
      );

    case EventActionTypes.SET_UPGRADE_TYPE_ID:
      return setUpgradeTypeId(
        state,
        payload as SetUpgradeTypeIdAction["payload"]
      );

    case EventActionTypes.SET_PROMOTION_ID:
      return setPromotionId(state, payload as SetPromotionIdAction["payload"]);

    case EventActionTypes.SET_CUSTOM_FIELD_ID:
      return setCustomFieldId(
        state,
        payload as SetCustomFieldIdAction["payload"]
      );
    /********************************************************************************
     *  Create Event
     *******************************************************************************/

    case EventActionTypes.CREATE_EVENT_REQUEST:
      return createEventRequest(
        state
        // payload as CreateEventRequestAction["payload"]
      );

    case EventActionTypes.CREATE_EVENT_SUCCESS:
      return createEventSuccess(
        state,
        payload as CreateEventSuccessAction["payload"]
      );

    case EventActionTypes.CREATE_EVENT_FAILURE:
      return createEventFailure(
        state,
        payload as CreateEventFailureAction["payload"]
      );
    /********************************************************************************
     *  Update Event
     *******************************************************************************/

    case EventActionTypes.UPDATE_EVENT_REQUEST:
      return updateEventRequest(
        state
        // payload as UpdateEventRequestAction["payload"]
      );

    case EventActionTypes.UPDATE_EVENT_SUCCESS:
      return updateEventSuccess(
        state,
        payload as UpdateEventSuccessAction["payload"]
      );

    case EventActionTypes.UPDATE_EVENT_FAILURE:
      return updateEventFailure(
        state,
        payload as UpdateEventFailureAction["payload"]
      );

    /********************************************************************************
     *  Publish Event
     *******************************************************************************/

    case EventActionTypes.PUBLISH_EVENT:
      return publishEvent(
        state
        // payload as CreateEventRequestAction["payload"]
      );

    case EventActionTypes.PUBLISH_EVENT_SUCCESS:
      return publishEventSuccess(
        state,
        payload as PublishEventSuccessAction["payload"]
      );

    case EventActionTypes.PUBLISH_EVENT_FAILURE:
      return publishEventFailure(
        state,
        payload as PublishEventFailureAction["payload"]
      );

    /********************************************************************************
     *  Event Cache
     *******************************************************************************/

    case EventActionTypes.CACHE_EVENTS:
      return cacheEvents(state, payload as CacheEventsAction["payload"]);

    /********************************************************************************
     *  Event Fields
     *******************************************************************************/

    case EventActionTypes.SET_EVENT_TYPE:
      return setEventType(state, payload as SetEventTypeAction["payload"]);
    case EventActionTypes.SET_EVENT_NAME:
      return setEventName(state, payload as SetEventNameAction["payload"]);
    case EventActionTypes.SET_EVENT_SUBTITLE:
      return setEventSubtitle(
        state,
        payload as SetEventSubtitleAction["payload"]
      );
    case EventActionTypes.SET_EVENT_DESCRIPTION:
      return setEventDescription(
        state,
        payload as SetEventDescriptionAction["payload"]
      );
    case EventActionTypes.SET_EVENT_POSTER_IMAGE_URL:
      return setEventPosterImageUrl(
        state,
        payload as SetEventPosterImageUrlAction["payload"]
      );
    case EventActionTypes.SET_EVENT_VENUE_ID:
      return setEventVenueId(
        state,
        payload as SetEventVenueIdAction["payload"]
      );
    case EventActionTypes.SET_EVENT_SEATING_CHART_FIELDS:
      return setEventSeatingChartFields(
        state,
        payload as SetEventSeatingChartFieldsAction["payload"]
      );
    case EventActionTypes.SET_EVENT_SEATING_CHART_KEY:
      return setEventSeatingChartKey(
        state,
        payload as SetEventSeatingChartKeyAction["payload"]
      );
    case EventActionTypes.CLEAR_EVENT_SEATING_CHART_FIELDS:
      return clearEventSeatingChartFields(
        state,
        payload as ClearEventSeatingChartFieldsAction["payload"]
      );
    case EventActionTypes.SET_EVENT_AGE:
      return setEventAge(state, payload as SetEventAgeAction["payload"]);
    case EventActionTypes.SET_EVENT_TAX_DEDUCTION:
      return setEventTaxDeduction(
        state,
        payload as SetEventTaxDeductionAction["payload"]
      );
    case EventActionTypes.SET_EVENT_USER_AGREEMENT:
      return setEventUserAgreement(
        state,
        payload as SetEventUserAgreementAction["payload"]
      );
    case EventActionTypes.SET_EVENT_PROCESS_AS:
      return setEventProcessAs(
        state,
        payload as SetEventProcessAsAction["payload"]
      );
    case EventActionTypes.SET_EVENT_SEND_QR_CODE:
      return setEventSendQRCode(
        state,
        payload as SetEventSendQRCodeAction["payload"]
      );

    /********************************************************************************
     *  Event Schedule Fields
     *******************************************************************************/
    case EventActionTypes.SET_EVENT_SALES_BEGIN_IMMEDIATELY:
      return setEventSalesBeginImmediately(
        state,
        payload as SetEventSalesBeginImmediatelyAction["payload"]
      );

    case EventActionTypes.SET_EVENT_SCHEDULE_ANNOUNCE_AT:
      return setEventScheduleAnnounceAt(
        state,
        payload as SetEventScheduleAnnounceAtAction["payload"]
      );
    case EventActionTypes.SET_EVENT_SCHEDULE_TICKETS_AT:
      return setEventScheduleTicketsAt(
        state,
        payload as SetEventScheduleTicketsAtAction["payload"]
      );
    case EventActionTypes.SET_EVENT_SCHEDULE_TICKETS_END_AT:
      return setEventScheduleTicketsEndAt(
        state,
        payload as SetEventScheduleTicketsEndAtAction["payload"]
      );
    case EventActionTypes.SET_EVENT_SCHEDULE_STARTS_AT:
      return setEventScheduleStartsAt(
        state,
        payload as SetEventScheduleStartsAtAction["payload"]
      );
    case EventActionTypes.SET_EVENT_SCHEDULE_ENDS_AT:
      return setEventScheduleEndsAt(
        state,
        payload as SetEventScheduleEndsAtAction["payload"]
      );

    /********************************************************************************
     *  Performance Fields
     *******************************************************************************/

    case EventActionTypes.ADD_PERFORMANCE_HEADLINING_ARTIST:
      return addPerformanceHeadliningArtist(
        state,
        payload as AddPerformanceHeadliningArtistAction["payload"]
      );

    case EventActionTypes.REMOVE_PERFORMANCE_HEADLINING_ARTIST:
      return removePerformanceHeadliningArtist(
        state,
        payload as RemovePerformanceHeadliningArtistAction["payload"]
      );

    case EventActionTypes.ADD_PERFORMANCE_OPENING_ARTIST:
      return addPerformanceOpeningArtist(
        state,
        payload as AddPerformanceOpeningArtistAction["payload"]
      );

    case EventActionTypes.REMOVE_PERFORMANCE_OPENING_ARTIST:
      return removePerformanceOpeningArtist(
        state,
        payload as RemovePerformanceOpeningArtistAction["payload"]
      );

    case EventActionTypes.SET_PERFORMANCE_SONG_LINK:
      return setPerformanceSongLink(
        state,
        payload as SetPerformanceSongLinkAction["payload"]
      );

    case EventActionTypes.SET_PERFORMANCE_VIDEO_LINK:
      return setPerformanceVideoLink(
        state,
        payload as SetPerformanceVideoLinkAction["payload"]
      );

    case EventActionTypes.SET_PERFORMANCE_SCHEDULE_DOORS_AT:
      return setPerformanceScheduleDoorsAt(
        state,
        payload as SetPerformanceScheduleDoorsAtAction["payload"]
      );
    case EventActionTypes.SET_PERFORMANCE_SCHEDULE_STARTS_AT:
      return setPerformanceScheduleStartsAt(
        state,
        payload as SetPerformanceScheduleStartsAtAction["payload"]
      );

    /********************************************************************************
     *  Ticket Type Fields
     *******************************************************************************/

    case EventActionTypes.SET_TICKET_TYPE:
      return setTicketType(state, payload as SetTicketTypeAction["payload"]);

    case EventActionTypes.ADD_TICKET_TYPE:
      return addTicketType(state, payload as AddTicketTypeAction["payload"]);
    case EventActionTypes.REMOVE_TICKET_TYPE:
      return removeTicketType(
        state,
        payload as RemoveTicketTypeAction["payload"]
      );
    case EventActionTypes.SET_TICKET_TYPE_VISIBLE:
      return setTicketTypeVisible(
        state,
        payload as SetTicketTypeVisibleAction["payload"]
      );
    case EventActionTypes.MOVE_TICKET_TYPE_UP:
      return moveTicketTypeUp(
        state,
        payload as MoveTicketTypeUpAction["payload"]
      );
    case EventActionTypes.MOVE_TICKET_TYPE_DOWN:
      return moveTicketTypeDown(
        state,
        payload as MoveTicketTypeDownAction["payload"]
      );
    case EventActionTypes.SET_TICKET_TYPE_NAME:
      return setTicketTypeName(
        state,
        payload as SetTicketTypeNameAction["payload"]
      );
    case EventActionTypes.SET_TICKET_TYPE_QTY:
      return setTicketTypeQty(
        state,
        payload as SetTicketTypeQtyAction["payload"]
      );
    case EventActionTypes.SET_TICKET_TYPE_PURCHASE_LIMIT:
      return setTicketTypePurchaseLimit(
        state,
        payload as SetTicketTypePurchaseLimitAction["payload"]
      );
    case EventActionTypes.SET_TICKET_TYPE_DESCRIPTION:
      return setTicketTypeDescription(
        state,
        payload as SetTicketTypeDescriptionAction["payload"]
      );
    case EventActionTypes.SET_TICKET_TYPE_VALUES:
      return setTicketTypeValues(
        state,
        payload as SetTicketTypeValuesAction["payload"]
      );

    /********************************************************************************
     *  Ticket Type Tier
     *******************************************************************************/

    case EventActionTypes.SET_TICKET_TYPE_TIER:
      return setTicketTypeTier(
        state,
        payload as SetTicketTypeTierAction["payload"]
      );
    case EventActionTypes.SET_IS_USING_PRICING_TIERS:
      return setIsUsingPricingTiers(
        state,
        payload as SetIsUsingPricingTiersAction["payload"]
      );
    case EventActionTypes.SET_TICKET_TYPE_TIER_ENDS_AT:
      return setTicketTypeTierEndsAt(
        state,
        payload as SetTicketTypeTierEndsAtAction["payload"]
      );
    case EventActionTypes.ADD_TICKET_TYPE_TIER:
      return addTicketTypeTier(
        state,
        payload as AddTicketTypeTierAction["payload"]
      );
    case EventActionTypes.REMOVE_TICKET_TYPE_TIER:
      return removeTicketTypeTier(
        state,
        payload as RemoveTicketTypeTierAction["payload"]
      );

    /********************************************************************************
     *  Upgrade Type
     *******************************************************************************/

    case EventActionTypes.SET_UPGRADE_TYPE:
      return setUpgradeType(state, payload as SetUpgradeTypeAction["payload"]);
    case EventActionTypes.ADD_UPGRADE_TYPE:
      return addUpgradeType(state, payload as AddUpgradeTypeAction["payload"]);
    case EventActionTypes.REMOVE_UPGRADE_TYPE:
      return removeUpgradeType(
        state,
        payload as RemoveUpgradeTypeAction["payload"]
      );
    case EventActionTypes.SET_UPGRADE_TYPE_VISIBLE:
      return setUpgradeTypeVisible(
        state,
        payload as SetUpgradeTypeVisibleAction["payload"]
      );
    case EventActionTypes.MOVE_UPGRADE_TYPE_UP:
      return moveUpgradeTypeUp(
        state,
        payload as MoveUpgradeTypeUpAction["payload"]
      );
    case EventActionTypes.MOVE_UPGRADE_TYPE_DOWN:
      return moveUpgradeTypeDown(
        state,
        payload as MoveUpgradeTypeDownAction["payload"]
      );
    case EventActionTypes.ADD_UPGRADE_TYPE_TICKET_TYPE_ID:
      return addUpgradeTypeTicketTypeId(
        state,
        payload as AddUpgradeTypeTicketTypeIdAction["payload"]
      );
    case EventActionTypes.REMOVE_UPGRADE_TYPE_TICKET_TYPE_ID:
      return removeUpgradeTypeTicketTypeId(
        state,
        payload as RemoveUpgradeTypeTicketTypeIdAction["payload"]
      );

    /********************************************************************************
     *  Promotion
     *******************************************************************************/

    case EventActionTypes.SET_PROMOTION:
      return setPromotion(state, payload as SetPromotionAction["payload"]);
    case EventActionTypes.ADD_PROMOTION:
      return addPromotion(state, payload as AddPromotionAction["payload"]);
    case EventActionTypes.REMOVE_PROMOTION:
      return removePromotion(
        state,
        payload as RemovePromotionAction["payload"]
      );
    case EventActionTypes.SET_PROMOTION_ACTIVE:
      return setPromotionActive(
        state,
        payload as SetPromotionActiveAction["payload"]
      );
    case EventActionTypes.MOVE_PROMOTION_UP:
      return movePromotionUp(
        state,
        payload as MovePromotionUpAction["payload"]
      );
    case EventActionTypes.MOVE_PROMOTION_DOWN:
      return movePromotionDown(
        state,
        payload as MovePromotionDownAction["payload"]
      );
    case EventActionTypes.ADD_PROMOTION_TICKET_TYPE_ID:
      return addPromotionTicketTypeId(
        state,
        payload as AddPromotionTicketTypeIdAction["payload"]
      );
    case EventActionTypes.REMOVE_PROMOTION_TICKET_TYPE_ID:
      return removePromotionTicketTypeId(
        state,
        payload as RemovePromotionTicketTypeIdAction["payload"]
      );

    /********************************************************************************
     *  Custom Field
     *******************************************************************************/

    case EventActionTypes.SET_CUSTOM_FIELD:
      return setCustomField(state, payload as SetCustomFieldAction["payload"]);
    case EventActionTypes.ADD_CUSTOM_FIELD:
      return addCustomField(state, payload as AddCustomFieldAction["payload"]);
    case EventActionTypes.REMOVE_CUSTOM_FIELD:
      return removeCustomField(
        state,
        payload as RemoveCustomFieldAction["payload"]
      );
    case EventActionTypes.SET_CUSTOM_FIELD_ACTIVE:
      return setCustomFieldActive(
        state,
        payload as SetCustomFieldActiveAction["payload"]
      );
    case EventActionTypes.MOVE_CUSTOM_FIELD_UP:
      return moveCustomFieldUp(
        state,
        payload as MoveCustomFieldUpAction["payload"]
      );
    case EventActionTypes.MOVE_CUSTOM_FIELD_DOWN:
      return moveCustomFieldDown(
        state,
        payload as MoveCustomFieldDownAction["payload"]
      );
    case EventActionTypes.ADD_CUSTOM_FIELD_OPTION:
      return addCustomFieldOption(
        state,
        payload as AddCustomFieldOptionAction["payload"]
      );
    case EventActionTypes.REMOVE_CUSTOM_FIELD_OPTION:
      return removeCustomFieldOption(
        state,
        payload as RemoveCustomFieldOptionAction["payload"]
      );

    case EventActionTypes.SET_CUSTOM_FIELD_OPTION:
      return setCustomFieldOption(
        state,
        payload as SetCustomFieldOptionAction["payload"]
      );

    case EventActionTypes.DELETE_EVENT:
      return deleteEventRequest(state);

    case EventActionTypes.DELETE_EVENT_SUCCESS:
      return deleteEventSuccess(
        state,
        payload as DeleteEventSuccessAction["payload"]
      );

    default:
      return state;
  }
}

/********************************************************************************
 *  Set Event ID
 *******************************************************************************/

function setEventId(
  state: EventReducerState,
  { eventId, replace = false }: { eventId: string; replace?: boolean }
): EventReducerState {
  UrlUtil.setQueryString({ eventId }, replace);

  return {
    ...state,
    eventId,
  };
}

/********************************************************************************
 *  Set Ticket Type ID
 *******************************************************************************/

function setTicketTypeId(
  state: EventReducerState,
  { ticketTypeId }: { ticketTypeId: string }
): EventReducerState {
  UrlUtil.setQueryString({ ticketTypeId });

  let isUsingPricingTiers = state.isUsingPricingTiers;

  if (!Boolean(ticketTypeId)) {
    isUsingPricingTiers = false;
  }

  return {
    ...state,
    ticketTypeId,
    isUsingPricingTiers,
  };
}

/********************************************************************************
 *  Set Upgrade Type ID
 *******************************************************************************/

function setUpgradeTypeId(
  state: EventReducerState,
  { upgradeTypeId }: { upgradeTypeId: string }
): EventReducerState {
  UrlUtil.setQueryString({ upgradeTypeId });

  return {
    ...state,
    upgradeTypeId,
  };
}

/********************************************************************************
 *  Set Promotion ID
 *******************************************************************************/

function setPromotionId(
  state: EventReducerState,
  { promotionId }: { promotionId: string }
): EventReducerState {
  UrlUtil.setQueryString({ promotionId });

  return {
    ...state,
    promotionId,
  };
}

/********************************************************************************
 *  Set Custom Field ID
 *******************************************************************************/

function setCustomFieldId(
  state: EventReducerState,
  { customFieldId }: { customFieldId: string }
): EventReducerState {
  UrlUtil.setQueryString({ customFieldId });

  return {
    ...state,
    customFieldId,
  };
}

/********************************************************************************
 *  Create Event
 *******************************************************************************/

function createEventRequest(state: EventReducerState): EventReducerState {
  return {
    ...state,
    saving: true,
  };
}

function createEventSuccess(
  state: EventReducerState,
  { event }: { event: IEventGraphQL }
): EventReducerState {
  state = { ...state };
  const eventId = event._id as string;

  state.saving = false;
  state.eventsCache[eventId] = event;
  state.eventsCache[NEW_EVENT_ID] = eventState();
  UrlUtil.setQueryString({ eventId }, true);
  return setEventId(state, { eventId, replace: true });
}

function createEventFailure(
  state: EventReducerState,
  { errorMsg }: { errorMsg: string }
): EventReducerState {
  return {
    ...state,
    errorMsg,
    saving: false,
  };
}

/********************************************************************************
 *  Update Event
 *******************************************************************************/

function updateEventRequest(state: EventReducerState): EventReducerState {
  return {
    ...state,
    saving: true,
  };
}

function updateEventSuccess(
  state: EventReducerState,
  { event }: { event: IEventGraphQL }
): EventReducerState {
  state = { ...state };
  const eventId = event._id as string;

  state.saving = false;
  state.eventsCache[eventId] = event;
  state.eventsCache[NEW_EVENT_ID] = eventState();
  return state;
}

function updateEventFailure(
  state: EventReducerState,
  { errorMsg }: { errorMsg: string }
): EventReducerState {
  return {
    ...state,
    errorMsg,
    saving: false,
  };
}

/********************************************************************************
 *  Publish Event
 *******************************************************************************/

function publishEvent(state: EventReducerState): EventReducerState {
  return {
    ...state,
    publishing: true,
  };
}

function publishEventSuccess(
  state: EventReducerState,
  { event }: { event: IEventGraphQL }
): EventReducerState {
  state = { ...state };
  const eventId = event._id as string;
  state.eventsCache[eventId] = event;
  state.publishing = false;
  return state;
}

function publishEventFailure(
  state: EventReducerState,
  { errorMsg }: { errorMsg: string }
): EventReducerState {
  return {
    ...state,
    errorMsg,
    publishing: false,
  };
}

/********************************************************************************
 *  Cache Events
 *******************************************************************************/

function cacheEvents(
  state: EventReducerState,
  { events }: { events: IEventGraphQL[] }
): EventReducerState {
  return {
    ...state,
    eventsCache: ReduxUtil.makeCache(events, "_id", state.eventsCache),
  };
}

/********************************************************************************
 *  Event Fields
 *******************************************************************************/

function setEvent(
  state: EventReducerState,
  { eventId, event }: { eventId?: string; event: Partial<IEvent> }
): EventReducerState {
  state = {
    ...state,
    errorMsg: "",
  };

  state.eventsCache[eventId as string] = {
    ...state.eventsCache[eventId as string],
    ...event,
  };

  return state;
}

/************************************************************
 *  Event Type
 ***********************************************************/

function setEventType(
  state: EventReducerState,
  { eventId, eventType }: { eventId: string; eventType: EventTypeEnum }
): EventReducerState {
  return setEvent(state, { eventId, event: { type: eventType } });
}

/************************************************************
 *  Event Name
 ***********************************************************/

function setEventName(
  state: EventReducerState,
  { eventId, name }: { eventId: string; name: string }
): EventReducerState {
  return setEvent(state, { eventId, event: { name } });
}

/************************************************************
 *  Event Subtitle
 ***********************************************************/

function setEventSubtitle(
  state: EventReducerState,
  { eventId, subtitle }: { eventId: string; subtitle: string }
): EventReducerState {
  return setEvent(state, { eventId, event: { subtitle } });
}

/************************************************************
 *  Event Description
 ***********************************************************/

function setEventDescription(
  state: EventReducerState,
  { eventId, description }: { eventId: string; description: string }
): EventReducerState {
  return setEvent(state, { eventId, event: { description } });
}

/************************************************************
 *  Event Poster Image Url
 ***********************************************************/

function setEventPosterImageUrl(
  state: EventReducerState,
  { eventId, posterImageUrl }: { eventId: string; posterImageUrl: string }
): EventReducerState {
  return setEvent(state, { eventId, event: { posterImageUrl } });
}

/************************************************************
 *  Event Venue ID
 ***********************************************************/

function setEventVenueId(
  state: EventReducerState,
  { eventId, venueId }: { eventId: string; venueId: string }
): EventReducerState {
  return setEvent(state, { eventId, event: { venueId } });
}

/************************************************************
 *  Event Seating Chart Fields
 ***********************************************************/

function setEventSeatingChartFields(
  state: EventReducerState,
  { eventId, categories }: { eventId: string; categories: any[] }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  const ticketTypes = Object.entries(categories).map(([key, value]) => {
    return ticketTypeState(
      shortid.generate(),
      key,
      value.length === 1 ? value[0].capacity : value.length
    );
  });

  const newTicketTypeIds = ticketTypes.map(
    (ticketType: ITicketType) => ticketType._id as string
  );

  const stateTicketTypeIds = event?.ticketTypes?.map(
    (ticketType: ITicketType) => ticketType._id as string
  );

  const upgrades = event?.upgrades?.map((upgrade: IEventUpgrade) => {
    if (upgrade.ticketTypeIds.length === stateTicketTypeIds?.length) {
      upgrade.ticketTypeIds = newTicketTypeIds;
    } else {
      upgrade.ticketTypeIds = [];
    }
    return upgrade;
  });

  return setEvent(state, { eventId, event: { ticketTypes, upgrades } });
}

/************************************************************
 *  Event Seating Chart Key
 ***********************************************************/

function setEventSeatingChartKey(
  state: EventReducerState,
  { eventId, seatingChartKey }: { eventId: string; seatingChartKey: string }
): EventReducerState {
  return setEvent(state, { eventId, event: { seatingChartKey } });
}

/************************************************************
 *  Clear Event Seating Chart Fields
 ***********************************************************/

function clearEventSeatingChartFields(
  state: EventReducerState,
  { eventId }: { eventId: string }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  event.ticketTypes = [];
  event.seatingChartKey = "";
  return setEvent(state, { eventId, event });
}

/************************************************************
 *  Event Age
 ***********************************************************/

function setEventAge(
  state: EventReducerState,
  { eventId, age }: { eventId: string; age: EventAgeEnum }
): EventReducerState {
  return setEvent(state, { eventId, event: { age } });
}

/************************************************************
 *  Event TaxDeduction
 ***********************************************************/

function setEventTaxDeduction(
  state: EventReducerState,
  { eventId, taxDeduction }: { eventId: string; taxDeduction: boolean }
): EventReducerState {
  return setEvent(state, { eventId, event: { taxDeduction } });
}

/************************************************************
 *  Event User Agreement
 ***********************************************************/

function setEventUserAgreement(
  state: EventReducerState,
  { eventId, userAgreement }: { eventId: string; userAgreement: string }
): EventReducerState {
  return setEvent(state, { eventId, event: { userAgreement } });
}

/************************************************************
 *  Event Process As
 ***********************************************************/

function setEventProcessAs(
  state: EventReducerState,
  { eventId, processAs }: { eventId: string; processAs: EventProcessAsEnum }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  // For RSVP Events
  if (processAs == EventProcessAsEnum.RSVP) {
    // Remove all tiers except the first tier on all tickets
    // Set the first tier price to 0
    state =
      event.ticketTypes?.reduce(
        (
          state: EventReducerState,
          ticketType: ITicketType
        ): EventReducerState => {
          state = ticketType.tiers.reduce(
            (
              state: EventReducerState,
              tier: ITicketTier,
              tierIndex: number
            ): EventReducerState => {
              if (tierIndex === 0) {
                return setTicketTypeTier(state, {
                  eventId: eventId,
                  ticketTypeId: ticketType._id as string,
                  tierId: tier._id as string,
                  tier: { price: 0 },
                });
              } else {
                return removeTicketTypeTier(state, {
                  eventId: eventId,
                  ticketTypeId: ticketType._id as string,
                  tierId: tier._id as string,
                });
              }
            },
            state
          );
          return state;
        },
        state
      ) ?? state;

    // Set all upgrade prices to 0
    state =
      event.upgrades?.reduce(
        (
          state: EventReducerState,
          upgradeType: IEventUpgrade
        ): EventReducerState => {
          return setUpgradeType(state, {
            eventId: eventId,
            upgradeTypeId: upgradeType._id as string,
            upgradeType: { price: 0 },
          });
        },
        state
      ) ?? state;
  }

  return setEvent(state, { eventId, event: { processAs } });
}

/************************************************************
 *  Event Send QR Code
 ***********************************************************/

function setEventSendQRCode(
  state: EventReducerState,
  { eventId, sendQRCode }: { eventId: string; sendQRCode: SendQRCodeEnum }
): EventReducerState {
  return setEvent(state, { eventId, event: { sendQRCode } });
}

/********************************************************************************
 *  Event Schedule Fields
 *******************************************************************************/

function setEventSchedule(
  state: EventReducerState,
  { eventId, schedule }: { eventId: string; schedule: Partial<IEventSchedule> }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  event.schedule = {
    ...event.schedule,
    ...schedule,
  };
  return setEvent(state, { eventId, event });
}

/************************************************************
 *  Sales Begin Immediately
 ***********************************************************/

function setEventSalesBeginImmediately(
  state: EventReducerState,
  {
    eventId,
    salesBeginImmediately,
  }: { eventId: string; salesBeginImmediately: boolean }
): EventReducerState {
  return setEvent(state, { eventId, event: { salesBeginImmediately } });
}

/************************************************************
 *  Event Schedule Announce At
 ***********************************************************/

function setEventScheduleAnnounceAt(
  state: EventReducerState,
  { eventId, announceAt }: { eventId: string; announceAt: number }
): EventReducerState {
  return setEventSchedule(state, { eventId, schedule: { announceAt } });
}

/************************************************************
 *  Event Schedule Tickets At
 ***********************************************************/

function setEventScheduleTicketsAt(
  state: EventReducerState,
  { eventId, ticketsAt }: { eventId: string; ticketsAt: number }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  state = (event.ticketTypes ?? [])?.reduce(
    (cur: EventReducerState, ticketType: ITicketType): EventReducerState => {
      const firstTier = ticketType.tiers[0];

      return setTicketTypeTierStartsAt(cur, {
        eventId: eventId,
        ticketTypeId: ticketType._id as string,
        tierId: firstTier._id as string,
        startsAt: ticketsAt,
      });
    },
    state
  );

  return setEventSchedule(state, { eventId, schedule: { ticketsAt } });
}

/************************************************************
 *  Event Schedule Tickets End At
 ***********************************************************/

function setEventScheduleTicketsEndAt(
  state: EventReducerState,
  { eventId, ticketsEndAt }: { eventId: string; ticketsEndAt: number }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  state = (event.ticketTypes ?? [])?.reduce(
    (cur: EventReducerState, ticketType: ITicketType): EventReducerState => {
      const lastTier = ticketType.tiers[
        ticketType.tiers.length - 1
      ] as ITicketTier;

      return setTicketTypeTierEndsAt(cur, {
        eventId: eventId,
        ticketTypeId: ticketType._id as string,
        tierId: lastTier._id as string,
        endsAt: ticketsEndAt,
      });
    },
    state
  );

  return setEventSchedule(state, { eventId, schedule: { ticketsEndAt } });
}

/************************************************************
 *  Event Schedule Starts At
 ***********************************************************/

function setEventScheduleStartsAt(
  state: EventReducerState,
  { eventId, startsAt }: { eventId: string; startsAt: number }
): EventReducerState {
  return setEventSchedule(state, { eventId, schedule: { startsAt } });
}

/************************************************************
 *  Event Schedule End At
 ***********************************************************/

function setEventScheduleEndsAt(
  state: EventReducerState,
  { eventId, endsAt }: { eventId: string; endsAt: number }
): EventReducerState {
  return setEventSchedule(state, { eventId, schedule: { endsAt } });
}

/********************************************************************************
 *  Performance Fields
 *******************************************************************************/

function setPerformance(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    performance,
  }: {
    eventId: string;
    performanceId: string;
    performance: Partial<IPerformance>;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  event.performances = [...(event.performances || [])]?.map(
    (statePerformance: IPerformance) => {
      if (statePerformance._id === performanceId) {
        return {
          ...statePerformance,
          ...performance,
        } as IPerformance;
      }

      return statePerformance;
    }
  );

  return setEvent(state, { eventId, event });
}

/************************************************************
 *  Add Performance Headlining Artist
 ***********************************************************/

function addPerformanceHeadliningArtist(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    artistId,
  }: { eventId: string; performanceId: string; artistId: string }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const performance = event.performances?.find(
    (performance: IPerformance) => performance._id === performanceId
  );
  const headliningArtistIds = [
    ...(performance?.headliningArtistIds || []),
    artistId,
  ];
  return setPerformance(state, {
    eventId,
    performanceId,
    performance: { headliningArtistIds },
  });
}

/************************************************************
 *  Remove Performance Headlining Artist
 ***********************************************************/

function removePerformanceHeadliningArtist(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    artistId,
  }: { eventId: string; performanceId: string; artistId: string }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  const performance = event.performances?.find(
    (performance: IPerformance) => performance._id === performanceId
  );

  const headliningArtistIds = performance?.headliningArtistIds?.filter(
    (stateArtistId: string) => stateArtistId !== artistId
  );
  return setPerformance(state, {
    eventId,
    performanceId,
    performance: { headliningArtistIds },
  });
}

/************************************************************
 *  Add Performance Opening Artist
 ***********************************************************/

function addPerformanceOpeningArtist(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    artistId,
  }: { eventId: string; performanceId: string; artistId: string }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const performance = event.performances?.find(
    (performance: IPerformance) => performance._id === performanceId
  );
  const openingArtistIds = [...(performance?.openingArtistIds || []), artistId];
  return setPerformance(state, {
    eventId,
    performanceId,
    performance: { openingArtistIds },
  });
}

/************************************************************
 *  Remove Performance Opening Artist
 ***********************************************************/

function removePerformanceOpeningArtist(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    artistId,
  }: { eventId: string; performanceId: string; artistId: string }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  const performance = event.performances?.find(
    (performance: IPerformance) => performance._id === performanceId
  );

  const openingArtistIds = performance?.openingArtistIds?.filter(
    (stateArtistId: string) => stateArtistId !== artistId
  );
  return setPerformance(state, {
    eventId,
    performanceId,
    performance: { openingArtistIds },
  });
}

/************************************************************
 *  Performance Song Link
 ***********************************************************/

function setPerformanceSongLink(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    songLink,
  }: { eventId: string; performanceId: string; songLink: string }
): EventReducerState {
  return setPerformance(state, {
    eventId,
    performanceId,
    performance: { songLink },
  });
}

/************************************************************
 *  Performance Video Link
 ***********************************************************/

function setPerformanceVideoLink(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    videoLink,
  }: { eventId: string; performanceId: string; videoLink: string }
): EventReducerState {
  return setPerformance(state, {
    eventId,
    performanceId,
    performance: { videoLink },
  });
}

/********************************************************************************
 *  Performance Schedule Fields
 *******************************************************************************/

function setPerformanceSchedule(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    schedule,
  }: {
    eventId: string;
    performanceId: string;
    schedule: Partial<IPerformanceSchedule>;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  event.performances = event.performances?.map((performance: IPerformance) => {
    if (performance._id === performanceId) {
      return {
        ...performance,
        schedule: {
          ...performance.schedule,
          ...schedule,
        },
      } as IPerformance;
    }

    return performance;
  });

  return setEvent(state, { eventId, event });
}

/************************************************************
 *  Peformance Schedule Doors At
 ***********************************************************/

function setPerformanceScheduleDoorsAt(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    doorsAt,
  }: { eventId: string; performanceId: string; doorsAt: number }
): EventReducerState {
  return setPerformanceSchedule(state, {
    eventId,
    performanceId,
    schedule: { doorsAt },
  });
}

/************************************************************
 *  Performance Schedule Starts At
 ***********************************************************/

function setPerformanceScheduleStartsAt(
  state: EventReducerState,
  {
    eventId,
    performanceId,
    startsAt,
  }: { eventId: string; performanceId: string; startsAt: number }
): EventReducerState {
  return setPerformanceSchedule(state, {
    eventId,
    performanceId,
    schedule: { startsAt, doorsAt: startsAt - Time.HOUR },
  });
}

/********************************************************************************
 *  Ticket Type
 *******************************************************************************/

function setTicketType(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    ticketType,
  }: {
    eventId: string;
    ticketTypeId: string;
    ticketType: Partial<ITicketType>;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  event.ticketTypes = event.ticketTypes?.map((stateTicketType: ITicketType) => {
    if (stateTicketType._id === ticketTypeId) {
      return {
        ...stateTicketType,
        ...ticketType,
      } as ITicketType;
    }

    return stateTicketType;
  });

  return setEvent(state, { eventId, event });
}

/************************************************************
 *  Add Ticket Type
 ***********************************************************/

function addTicketType(
  state: EventReducerState,
  {
    eventId,
    setUrlParam = true,
  }: {
    eventId: string;
    setUrlParam?: boolean;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const ticketTypes = [...(event?.ticketTypes || [])];
  const ticketTypeId = shortid.generate();
  const newTicketType = ticketTypeState(ticketTypeId, "New Ticket");
  ticketTypes.push(newTicketType);

  const newTicketTypeIds = ticketTypes.map(
    (ticketType: ITicketType) => ticketType._id as string
  );

  const stateTicketTypeIds = event?.ticketTypes?.map(
    (ticketType: ITicketType) => ticketType._id as string
  );

  const upgrades = event?.upgrades?.map((upgrade: IEventUpgrade) => {
    if (upgrade.ticketTypeIds.length === stateTicketTypeIds?.length) {
      upgrade.ticketTypeIds = newTicketTypeIds;
    } else {
      upgrade.ticketTypeIds = [];
    }
    return upgrade;
  });

  state = setEvent(state, { eventId, event: { ticketTypes, upgrades } });

  if (setUrlParam) {
    return setTicketTypeId(state, { ticketTypeId });
  } else {
    return state;
  }
}

/************************************************************
 *  Remove Ticket Type
 ***********************************************************/

function removeTicketType(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
  }: {
    eventId: string;
    ticketTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const ticketTypes = [...(event?.ticketTypes || [])].filter(
    (ticketType: ITicketType) => {
      return ticketType._id !== ticketTypeId;
    }
  );
  const upgrades = [...(event?.upgrades || [])].map(
    (upgrade: IEventUpgrade) => {
      upgrade.ticketTypeIds = upgrade.ticketTypeIds.filter(
        (stateTicketTypeId) => stateTicketTypeId !== ticketTypeId
      );
      return upgrade;
    }
  );

  return setEvent(state, { eventId, event: { ticketTypes, upgrades } });
}

/************************************************************
 *  Set Ticket Type Visible
 ***********************************************************/

function setTicketTypeVisible(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    visible,
  }: {
    eventId: string;
    ticketTypeId: string;
    visible: boolean;
  }
): EventReducerState {
  return setTicketType(state, {
    eventId,
    ticketTypeId,
    ticketType: { visible },
  });
}

/************************************************************
 *  Move Ticket Type Up
 ***********************************************************/

function moveTicketTypeUp(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
  }: {
    eventId: string;
    ticketTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const currentIndex = event?.ticketTypes
    ?.map((ticketType) => ticketType._id)
    .indexOf(ticketTypeId) as number;

  const desiredIndex = currentIndex - 1;
  const ticketTypes = [...(event?.ticketTypes || [])];
  const ticketType = ticketTypes?.splice(currentIndex, 1);
  ticketTypes.splice(desiredIndex, 0, ticketType[0]);

  return setEvent(state, { eventId, event: { ticketTypes } });
}

/************************************************************
 *  Move Ticket Type Down
 ***********************************************************/

function moveTicketTypeDown(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
  }: {
    eventId: string;
    ticketTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const currentIndex = event?.ticketTypes
    ?.map((ticketType) => ticketType._id)
    .indexOf(ticketTypeId) as number;

  const desiredIndex = currentIndex + 1;
  const ticketTypes = [...(event?.ticketTypes || [])];
  const ticketType = ticketTypes?.splice(currentIndex, 1);
  ticketTypes.splice(desiredIndex, 0, ticketType[0]);

  return setEvent(state, { eventId, event: { ticketTypes } });
}

/************************************************************
 *  Ticket Type Name
 ***********************************************************/

function setTicketTypeName(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    name,
  }: { eventId: string; ticketTypeId: string; name: string }
): EventReducerState {
  return setTicketType(state, {
    eventId,
    ticketTypeId,
    ticketType: { name },
  });
}

/************************************************************
 *  Ticket Type Qty
 ***********************************************************/

function setTicketTypeQty(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    qty,
  }: { eventId: string; ticketTypeId: string; qty: number }
): EventReducerState {
  return setTicketType(state, {
    eventId,
    ticketTypeId,
    ticketType: {},
  });
}

/************************************************************
 *  Ticket Type Values
 ***********************************************************/

function setTicketTypeValues(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    values,
  }: { eventId: string; ticketTypeId: string; values: string }
): EventReducerState {
  return setTicketType(state, {
    eventId,
    ticketTypeId,
    ticketType: { values },
  });
}

/************************************************************
 *  Ticket Type Purchase Limit
 ***********************************************************/

function setTicketTypePurchaseLimit(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    purchaseLimit,
  }: { eventId: string; ticketTypeId: string; purchaseLimit: number }
): EventReducerState {
  return setTicketType(state, {
    eventId,
    ticketTypeId,
    ticketType: { purchaseLimit },
  });
}

/************************************************************
 *  Ticket Type Description
 ***********************************************************/

function setTicketTypeDescription(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    description,
  }: { eventId: string; ticketTypeId: string; description: string }
): EventReducerState {
  return setTicketType(state, {
    eventId,
    ticketTypeId,
    ticketType: { description },
  });
}

/********************************************************************************
 *  Ticket Type Tier
 *******************************************************************************/

function setTicketTypeTier(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    tierId,
    tier,
  }: {
    eventId: string;
    ticketTypeId: string;
    tierId: string;
    tier: Partial<ITicketTier>;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const ticketType = event.ticketTypes?.find(
    (ticketType) => ticketType._id === ticketTypeId
  );

  const tiers = ticketType?.tiers.map((stateTier: ITicketTier) => {
    if (stateTier._id === tierId) {
      return {
        ...stateTier,
        ...tier,
      };
    }
    return stateTier;
  });

  return setTicketType(state, {
    eventId,
    ticketTypeId,
    ticketType: { tiers },
  });
}

/************************************************************
 *  Is Using Pricing Tiers
 ***********************************************************/

function setIsUsingPricingTiers(
  state: EventReducerState,
  {
    isUsingPricingTiers,
  }: {
    isUsingPricingTiers: boolean;
  }
): EventReducerState {
  const { eventId, ticketTypeId } = state;
  const event = { ...state.eventsCache[eventId] };
  const ticketType = event.ticketTypes?.find(
    (ticketType) => ticketType._id === ticketTypeId
  );
  const tiersLength = ticketType?.tiers.length;

  if (isUsingPricingTiers) {
    if (tiersLength === 1) {
      state = addTicketTypeTier(state, {
        eventId,
        ticketTypeId,
      });
    }
  } else {
    const tier = ticketTierState(
      shortid.generate(),
      "New Tier",
      0,
      event.schedule?.ticketsAt as number,
      event.schedule?.ticketsEndAt as number
    );

    state = setTicketType(state, {
      eventId,
      ticketTypeId,
      ticketType: { tiers: [tier] },
    });
  }

  return {
    ...state,
    isUsingPricingTiers,
  };
}

/************************************************************
 *  Set Ticket Tier Starts At
 ***********************************************************/

function setTicketTypeTierStartsAt(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    tierId,
    startsAt,
  }: {
    eventId: string;
    ticketTypeId: string;
    tierId: string;
    startsAt: number | null;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const ticketType = event.ticketTypes?.find(
    (ticketType) => ticketType._id === ticketTypeId
  );

  state = setTicketTypeTier(state, {
    eventId: eventId,
    ticketTypeId: ticketTypeId,
    tierId: tierId,
    tier: { startsAt },
  });

  const tierIndex = ticketType?.tiers.map((tier) => tier._id).indexOf(tierId);

  if (tierIndex) {
    const previousTierIndex = tierIndex - 1;
    const previousTier = ticketType?.tiers[previousTierIndex];

    if (previousTier) {
      state = setTicketTypeTier(state, {
        eventId: eventId,
        ticketTypeId: ticketTypeId,
        tierId: previousTier._id as string,
        tier: { endsAt: startsAt === null ? null : startsAt - 1 },
      });
    }
  }

  return state;
}

/************************************************************
 *  Set Ticket Tier Ends At
 ***********************************************************/

function setTicketTypeTierEndsAt(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    tierId,
    endsAt,
  }: {
    eventId: string;
    ticketTypeId: string;
    tierId: string;
    endsAt: number | null;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const ticketType = event.ticketTypes?.find(
    (ticketType) => ticketType._id === ticketTypeId
  );

  state = setTicketTypeTier(state, {
    eventId: eventId,
    ticketTypeId: ticketTypeId,
    tierId: tierId,
    tier: { endsAt },
  });

  const tierIndex = ticketType?.tiers.map((tier) => tier._id).indexOf(tierId);

  if (typeof tierIndex === "number" && tierIndex > -1) {
    const nextTierIndex = tierIndex + 1;
    const nextTier = ticketType?.tiers[nextTierIndex];

    if (nextTier) {
      state = setTicketTypeTier(state, {
        eventId: eventId,
        ticketTypeId: ticketTypeId,
        tierId: nextTier._id as string,
        tier: { startsAt: endsAt === null ? null : endsAt + 1 },
      });
    }
  }

  return state;
}

/************************************************************
 *  Add Ticket Type Tier
 ***********************************************************/

function addTicketTypeTier(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
  }: {
    eventId: string;
    ticketTypeId: string;
  }
): EventReducerState {
  let event = { ...state.eventsCache[eventId] };
  let ticketType = event.ticketTypes?.find(
    (ticketType) => ticketType._id === ticketTypeId
  );

  let tiers = [...(ticketType?.tiers || [])];
  const lastTier = tiers.pop();

  const newTier = ticketTierState(
    shortid.generate(),
    "New Tier",
    lastTier?.price,
    null,
    null
  );
  tiers.push(newTier);
  tiers.push(lastTier as ITicketTier);

  state = setTicketType(state, {
    eventId,
    ticketTypeId,
    ticketType: { tiers },
  });

  event = { ...state.eventsCache[eventId] };
  ticketType = event.ticketTypes?.find(
    (ticketType) => ticketType._id === ticketTypeId
  );

  const tierIndex = ticketType?.tiers
    .map((tier) => tier._id)
    .indexOf(newTier._id);

  if (tierIndex && tierIndex > -1) {
    const previousTierIndex = tierIndex - 1;
    const previousTier = ticketType?.tiers[previousTierIndex];
    if (previousTier) {
      state = setTicketTypeTierEndsAt(state, {
        eventId: eventId,
        ticketTypeId: ticketTypeId,
        tierId: previousTier._id as string,
        endsAt: previousTier.endsAt,
      });
    }
  }

  if (tiers.length === 2) {
    state = setTicketTypeTierStartsAt(state, {
      eventId: eventId,
      ticketTypeId: ticketTypeId,
      tierId: newTier._id as string,
      startsAt: event?.schedule?.ticketsAt || null,
    });
  }

  state = setTicketTypeTierEndsAt(state, {
    eventId: eventId,
    ticketTypeId: ticketTypeId,
    tierId: newTier._id as string,
    endsAt: null,
  });

  return state;
}

/************************************************************
 *  Remove Ticket Type Tier
 ***********************************************************/

function removeTicketTypeTier(
  state: EventReducerState,
  {
    eventId,
    ticketTypeId,
    tierId,
  }: {
    eventId: string;
    ticketTypeId: string;
    tierId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const ticketType = event.ticketTypes?.find(
    (ticketType) => ticketType._id === ticketTypeId
  );

  const tiers = ticketType?.tiers.filter((stateTier: ITicketTier) => {
    return stateTier._id !== tierId;
  });

  state = setTicketType(state, {
    eventId,
    ticketTypeId,
    ticketType: { tiers },
  });

  const tierIndex = ticketType?.tiers.map((tier) => tier._id).indexOf(tierId);

  if (tierIndex && tierIndex > -1) {
    const previousTierIndex = tierIndex - 1;
    const previousTier = ticketType?.tiers[previousTierIndex];

    if (previousTier) {
      state = setTicketTypeTierEndsAt(state, {
        eventId: eventId,
        ticketTypeId: ticketTypeId,
        tierId: previousTier._id as string,
        endsAt: previousTier.endsAt,
      });
    }
  }

  return state;
}

/********************************************************************************
 *  Upgrade Type
 *******************************************************************************/

function setUpgradeType(
  state: EventReducerState,
  {
    eventId,
    upgradeTypeId,
    upgradeType,
  }: {
    eventId: string;
    upgradeTypeId: string;
    upgradeType: Partial<IEventUpgrade>;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  event.upgrades = event.upgrades?.map((stateUpgradeType: IEventUpgrade) => {
    if (stateUpgradeType._id === upgradeTypeId) {
      return {
        ...stateUpgradeType,
        ...upgradeType,
      } as IEventUpgrade;
    }

    return stateUpgradeType;
  });

  return setEvent(state, { eventId, event });
}

/************************************************************
 *  Add Upgrade Type
 ***********************************************************/

function addUpgradeType(
  state: EventReducerState,
  {
    eventId,
  }: {
    eventId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const ticketTypeIds = event.ticketTypes?.map(
    (ticketType) => ticketType._id as string
  ) as string[];
  const upgradeTypes = [...(event?.upgrades || [])];
  const upgradeTypeId = shortid.generate();
  const newUpgradeType = upgradeState(
    upgradeTypeId,
    "New Upgrade",
    ticketTypeIds
  );
  upgradeTypes.push(newUpgradeType);

  state = setEvent(state, { eventId, event: { upgrades: upgradeTypes } });
  return setUpgradeTypeId(state, { upgradeTypeId });
}

/************************************************************
 *  Remove Upgrade Type
 ***********************************************************/

function removeUpgradeType(
  state: EventReducerState,
  {
    eventId,
    upgradeTypeId,
  }: {
    eventId: string;
    upgradeTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const upgradeTypes = [...(event?.upgrades || [])].filter(
    (upgradeType: IEventUpgrade) => {
      return upgradeType._id !== upgradeTypeId;
    }
  );
  return setEvent(state, { eventId, event: { upgrades: upgradeTypes } });
}

/************************************************************
 *  Set Upgrade Type Visible
 ***********************************************************/

function setUpgradeTypeVisible(
  state: EventReducerState,
  {
    eventId,
    upgradeTypeId,
    visible,
  }: {
    eventId: string;
    upgradeTypeId: string;
    visible: boolean;
  }
): EventReducerState {
  return setUpgradeType(state, {
    eventId,
    upgradeTypeId,
    upgradeType: { visible },
  });
}

/************************************************************
 *  Move Upgrade Type Up
 ***********************************************************/

function moveUpgradeTypeUp(
  state: EventReducerState,
  {
    eventId,
    upgradeTypeId,
  }: {
    eventId: string;
    upgradeTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const currentIndex = event?.upgrades
    ?.map((upgradeType) => upgradeType._id)
    .indexOf(upgradeTypeId) as number;

  const desiredIndex = currentIndex - 1;
  const upgradeTypes = [...(event?.upgrades || [])];
  const upgradeType = upgradeTypes?.splice(currentIndex, 1);
  upgradeTypes.splice(desiredIndex, 0, upgradeType[0]);

  return setEvent(state, { eventId, event: { upgrades: upgradeTypes } });
}

/************************************************************
 *  Move Upgrade Type Down
 ***********************************************************/

function moveUpgradeTypeDown(
  state: EventReducerState,
  {
    eventId,
    upgradeTypeId,
  }: {
    eventId: string;
    upgradeTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const currentIndex = event?.upgrades
    ?.map((upgradeType) => upgradeType._id)
    .indexOf(upgradeTypeId) as number;

  const desiredIndex = currentIndex + 1;
  const upgradeTypes = [...(event?.upgrades || [])];
  const upgradeType = upgradeTypes?.splice(currentIndex, 1);
  upgradeTypes.splice(desiredIndex, 0, upgradeType[0]);

  return setEvent(state, { eventId, event: { upgrades: upgradeTypes } });
}

/************************************************************
 *  Add Upgrade Type Ticket Type Id
 ***********************************************************/

function addUpgradeTypeTicketTypeId(
  state: EventReducerState,
  {
    eventId,
    upgradeTypeId,
    ticketTypeId,
  }: {
    eventId: string;
    upgradeTypeId: string;
    ticketTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const upgradeType = event.upgrades?.find(
    (upgradeType) => upgradeType._id === upgradeTypeId
  );
  const ticketTypeIds = [...(upgradeType?.ticketTypeIds || []), ticketTypeId];

  return setUpgradeType(state, {
    eventId,
    upgradeTypeId,
    upgradeType: { ticketTypeIds },
  });
}

/************************************************************
 *  Remove Upgrade Type Ticket Type Id
 ***********************************************************/

function removeUpgradeTypeTicketTypeId(
  state: EventReducerState,
  {
    eventId,
    upgradeTypeId,
    ticketTypeId,
  }: {
    eventId: string;
    upgradeTypeId: string;
    ticketTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const upgradeType = event.upgrades?.find(
    (upgradeType) => upgradeType._id === upgradeTypeId
  );
  const ticketTypeIds = upgradeType?.ticketTypeIds.filter(
    (stateTicketTypeId) => stateTicketTypeId !== ticketTypeId
  );

  return setUpgradeType(state, {
    eventId,
    upgradeTypeId,
    upgradeType: { ticketTypeIds },
  });
}

/********************************************************************************
 *  Promotion
 *******************************************************************************/

function setPromotion(
  state: EventReducerState,
  {
    eventId,
    promotionId,
    promotion,
  }: {
    eventId: string;
    promotionId: string;
    promotion: Partial<IEventPromotion>;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  event.promotions = event?.promotions?.map(
    (statePromotion: IEventPromotion) => {
      if (statePromotion._id === promotionId) {
        return {
          ...statePromotion,
          ...promotion,
        } as IEventPromotion;
      }

      return statePromotion;
    }
  );

  return setEvent(state, { eventId, event });
}

/************************************************************
 *  Add Promotion
 ***********************************************************/

function addPromotion(
  state: EventReducerState,
  {
    eventId,
  }: {
    eventId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const promotions = [...(event?.promotions || [])];
  const promotionId = shortid.generate();
  const newPromotion = eventPromotionState(promotionId, "New Code");
  promotions.push(newPromotion);

  state = setEvent(state, { eventId, event: { promotions: promotions } });
  return setPromotionId(state, { promotionId });
}

/************************************************************
 *  Remove Promotion
 ***********************************************************/

function removePromotion(
  state: EventReducerState,
  {
    eventId,
    promotionId,
  }: {
    eventId: string;
    promotionId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const promotions = [...(event?.promotions || [])].filter(
    (promotion: IEventPromotion) => {
      return promotion._id !== promotionId;
    }
  );
  return setEvent(state, { eventId, event: { promotions: promotions } });
}

/************************************************************
 *  Set Promotion Active
 ***********************************************************/

function setPromotionActive(
  state: EventReducerState,
  {
    eventId,
    promotionId,
    active,
  }: {
    eventId: string;
    promotionId: string;
    active: boolean;
  }
): EventReducerState {
  return setPromotion(state, { eventId, promotionId, promotion: { active } });
}

/************************************************************
 *  Move Promotion Up
 ***********************************************************/

function movePromotionUp(
  state: EventReducerState,
  {
    eventId,
    promotionId,
  }: {
    eventId: string;
    promotionId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const currentIndex = event?.promotions
    ?.map((promotion) => promotion._id)
    .indexOf(promotionId) as number;

  const desiredIndex = currentIndex - 1;
  const promotions = [...(event?.promotions || [])];
  const promotion = promotions?.splice(currentIndex, 1);
  promotions.splice(desiredIndex, 0, promotion[0]);

  return setEvent(state, { eventId, event: { promotions: promotions } });
}

/************************************************************
 *  Move Promotion Down
 ***********************************************************/

function movePromotionDown(
  state: EventReducerState,
  {
    eventId,
    promotionId,
  }: {
    eventId: string;
    promotionId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const currentIndex = event?.promotions
    ?.map((promotion) => promotion._id)
    .indexOf(promotionId) as number;

  const desiredIndex = currentIndex + 1;
  const promotions = [...(event?.promotions || [])];
  const promotion = promotions?.splice(currentIndex, 1);
  promotions.splice(desiredIndex, 0, promotion[0]);

  return setEvent(state, { eventId, event: { promotions: promotions } });
}

/************************************************************
 *  Add Promotion Ticket Type Id
 ***********************************************************/

function addPromotionTicketTypeId(
  state: EventReducerState,
  {
    eventId,
    promotionId,
    ticketTypeId,
  }: {
    eventId: string;
    promotionId: string;
    ticketTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const promotion = event.promotions?.find(
    (promotion) => promotion._id === promotionId
  );
  const ticketTypeIds = [...(promotion?.ticketTypeIds || []), ticketTypeId];

  return setPromotion(state, {
    eventId,
    promotionId,
    promotion: { ticketTypeIds },
  });
}

/************************************************************
 *  Remove Promotion Ticket Type Id
 ***********************************************************/

function removePromotionTicketTypeId(
  state: EventReducerState,
  {
    eventId,
    promotionId,
    ticketTypeId,
  }: {
    eventId: string;
    promotionId: string;
    ticketTypeId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const promotion = event.promotions?.find(
    (promotion) => promotion._id === promotionId
  );
  const ticketTypeIds = promotion?.ticketTypeIds.filter(
    (stateTicketTypeId) => stateTicketTypeId !== ticketTypeId
  );

  return setPromotion(state, {
    eventId,
    promotionId,
    promotion: { ticketTypeIds },
  });
}

/********************************************************************************
 *  CustomField
 *******************************************************************************/

function setCustomField(
  state: EventReducerState,
  {
    eventId,
    customFieldId,
    customField,
  }: {
    eventId: string;
    customFieldId: string;
    customField: Partial<IEventCustomField>;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };

  event.customFields = event.customFields?.map(
    (stateCustomField: IEventCustomField) => {
      if (stateCustomField._id === customFieldId) {
        return {
          ...stateCustomField,
          ...customField,
        } as IEventCustomField;
      }

      return stateCustomField;
    }
  );

  return setEvent(state, { eventId, event });
}

/************************************************************
 *  Add CustomField
 ***********************************************************/

function addCustomField(
  state: EventReducerState,
  {
    eventId,
  }: {
    eventId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const customFields = [...(event?.customFields || [])];
  const customFieldId = shortid.generate();
  const newCustomField = eventCustomFieldState(
    customFieldId,
    "New Survey Question"
  );
  customFields.push(newCustomField);

  state = setEvent(state, { eventId, event: { customFields: customFields } });
  return setCustomFieldId(state, { customFieldId });
}

/************************************************************
 *  Remove CustomField
 ***********************************************************/

function removeCustomField(
  state: EventReducerState,
  {
    eventId,
    customFieldId,
  }: {
    eventId: string;
    customFieldId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const customFields = [...(event?.customFields || [])].filter(
    (customField: IEventCustomField) => {
      return customField._id !== customFieldId;
    }
  );
  return setEvent(state, { eventId, event: { customFields: customFields } });
}

/************************************************************
 *  Set CustomField Active
 ***********************************************************/

function setCustomFieldActive(
  state: EventReducerState,
  {
    eventId,
    customFieldId,
    active,
  }: {
    eventId: string;
    customFieldId: string;
    active: boolean;
  }
): EventReducerState {
  return setCustomField(state, {
    eventId,
    customFieldId,
    customField: { active },
  });
}

/************************************************************
 *  Move CustomField Up
 ***********************************************************/

function moveCustomFieldUp(
  state: EventReducerState,
  {
    eventId,
    customFieldId,
  }: {
    eventId: string;
    customFieldId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const currentIndex = event?.customFields
    ?.map((customField) => customField._id)
    .indexOf(customFieldId) as number;

  const desiredIndex = currentIndex - 1;
  const customFields = [...(event?.customFields || [])];
  const customField = customFields?.splice(currentIndex, 1);
  customFields.splice(desiredIndex, 0, customField[0]);

  return setEvent(state, { eventId, event: { customFields: customFields } });
}

/************************************************************
 *  Move CustomField Down
 ***********************************************************/

function moveCustomFieldDown(
  state: EventReducerState,
  {
    eventId,
    customFieldId,
  }: {
    eventId: string;
    customFieldId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const currentIndex = event?.customFields
    ?.map((customField) => customField._id)
    .indexOf(customFieldId) as number;

  const desiredIndex = currentIndex + 1;
  const customFields = [...(event?.customFields || [])];
  const customField = customFields?.splice(currentIndex, 1);
  customFields.splice(desiredIndex, 0, customField[0]);

  return setEvent(state, { eventId, event: { customFields: customFields } });
}

/************************************************************
 *  Add CustomField Option
 ***********************************************************/

function addCustomFieldOption(
  state: EventReducerState,
  {
    eventId,
    customFieldId,
  }: {
    eventId: string;
    customFieldId: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const customField = event.customFields?.find(
    (customField) => customField._id === customFieldId
  );
  const options = [...(customField?.options || []), "New Option"];

  return setCustomField(state, {
    eventId,
    customFieldId,
    customField: { options },
  });
}

/************************************************************
 *  Remove CustomField Option
 ***********************************************************/

function removeCustomFieldOption(
  state: EventReducerState,
  {
    eventId,
    customFieldId,
    optionIndex,
  }: {
    eventId: string;
    customFieldId: string;
    optionIndex: number;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const customField = event.customFields?.find(
    (customField) => customField._id === customFieldId
  );
  const options = customField?.options.filter(
    (_, index) => index !== optionIndex
  );

  return setCustomField(state, {
    eventId,
    customFieldId,
    customField: { options },
  });
}

/************************************************************
 *  Set Custom Field Option
 ***********************************************************/

function setCustomFieldOption(
  state: EventReducerState,
  {
    eventId,
    customFieldId,
    optionIndex,
    option,
  }: {
    eventId: string;
    customFieldId: string;
    optionIndex: number;
    option: string;
  }
): EventReducerState {
  const event = { ...state.eventsCache[eventId] };
  const customField = event.customFields?.find(
    (customField) => customField._id === customFieldId
  );
  const options = [...(customField?.options || [])];
  options[optionIndex] = option;

  return setCustomField(state, {
    eventId,
    customFieldId,
    customField: { options },
  });
}

/********************************************************************************
 *  Delete Event
 *******************************************************************************/
function deleteEventRequest(state: EventReducerState): EventReducerState {
  return {
    ...state,
    saving: true,
  };
}

function deleteEventSuccess(
  state: EventReducerState,
  { eventId }: { eventId: string }
): EventReducerState {
  state = { ...state };
  state.saving = false;
  state.eventId = "";
  delete state.eventsCache[eventId];
  return { ...state };
}

function deleteEventFailure(
  state: EventReducerState,
  { errorMsg }: { errorMsg: string }
): EventReducerState {
  return {
    ...state,
    errorMsg,
    saving: false,
  };
}
