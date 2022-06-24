import { useSelector, useDispatch } from "react-redux";
import { BackstageState } from "../redux/store";
import { useQuery } from "@apollo/react-hooks";
import * as EventActions from "../redux/actions/event.actions";
import * as ArtistActions from "../redux/actions/artist.actions";
import * as FeeActions from "../redux/actions/fee.actions";
import { IEventGraphQL } from "@test/models/.dist/interfaces/IEvent";
import IArtist from "@test/models/.dist/interfaces/IArtist";
import IFee from "@test/models/.dist/interfaces/IFee";
import { ApolloError } from "apollo-client";
import GET_EVENT from "@test/models/.dist/graphql/queries/event.query";

interface EventData {
  event: IEventGraphQL;
}

interface EventVars {
  eventId: string;
}

type UseEvent = {
  event: IEventGraphQL | undefined;
  eventId: string;
  loading: boolean;
  error: ApolloError | undefined;
};

type UseEventHook = (eventId?: string) => UseEvent;

const useEventHook: UseEventHook = (eventId) => {
  /* State */
  const { eventId: stateEventId, eventsCache } = useSelector(
    (state: BackstageState) => state.event
  );

  eventId = (stateEventId || eventId) as string;

  const event = eventsCache[eventId];

  /* Actions */
  const dispatch = useDispatch();
  const cacheEvent = (event: IEventGraphQL) =>
    dispatch(EventActions.cacheEvents([event]));
  const cacheArtists = (artists: IArtist[]) =>
    dispatch(ArtistActions.cacheArtists(artists));
  const cacheFees = (fees: IFee[]) => dispatch(FeeActions.cacheFees(fees));

  /* Hooks */
  const { loading, error } = useQuery<EventData, EventVars>(GET_EVENT, {
    variables: {
      eventId,
    },
    onCompleted: (data) => {
      if (data.event && !event) {
        cacheEvent(data.event);
        cacheArtists(data.event.artists);
        cacheFees(data.event.fees);
      }
    },
  });

  return {
    event: event,
    eventId: eventId,
    loading: event ? false : loading,
    error: error,
  };
};

export default useEventHook;
