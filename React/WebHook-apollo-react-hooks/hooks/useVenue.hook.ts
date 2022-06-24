import { useSelector, useDispatch } from "react-redux";
import { BackstageState } from "../redux/store";
import { useQuery } from '@apollo/react-hooks';
import * as VenueActions from "../redux/actions/venue.actions";
import IVenue from '@test/models/.dist/interfaces/IVenue';
import { ApolloError } from "apollo-client";
import GET_VENUE from '@test/models/.dist/graphql/queries/venue.query';

type UseVenue = {
  venue: IVenue | undefined;
  venueId: string;
  loading: boolean;
  error: ApolloError | undefined
};

type UseVenueHook = (venueId?: string) => UseVenue;

const useVenueHook: UseVenueHook = (venueId) => {
  /* State */
  const {
    venueId: stateVenueId,
    venuesCache,
  } = useSelector(
    (state: BackstageState) => state.venue
  );

  venueId = (stateVenueId || venueId) as string;

  const venue = venuesCache[venueId];

  /* Actions */
  const dispatch = useDispatch();
  const cacheVenue = (venue: IVenue) =>
    dispatch(VenueActions.cacheVenues([venue]));

  /* Hooks */
  const { loading, error } = useQuery(GET_VENUE, {
    variables: {
      venueId
    },
    onCompleted: (data) => {
      if (data.venue && !venue) {
        cacheVenue(data.venue);
      }
    }
  });

  return {
    venue: venue,
    venueId: venueId,
    loading: venue ? false : loading,
    error: error,
  };
};

export default useVenueHook;
