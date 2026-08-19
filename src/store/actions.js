import { axiosFileInstance, axiosInstance } from '../axios';
import { API } from '../constants/API';
import { toast } from 'react-toastify';

export const GET_SONGS = 'GET_SONGS';
export const GET_SONG = 'GET_SONG';
export const SORT_SONGS = 'SORT_SONGS';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const GET_ALL_SONGS_COUNT = 'GET_ALL_SONGS_COUNT';
export const SET_SONG_RATING = 'SET_SONG_RATING';
export const DELETE_SONGS = 'DELETE_SONGS';

export const getSongs = (songs) => ({
  type: GET_SONGS,
  payload: songs,
});

export const getSong = (song) => ({
  type: GET_SONG,
  payload: song,
});

export const sortSongs = (parameter, isAscending) => ({
  type: SORT_SONGS,
  payload: { parameter, isAscending },
});

export const setIsLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  payload: isLoading,
});

export const getAllSongsCount = (count) => ({
  type: GET_ALL_SONGS_COUNT,
  payload: count,
});

export const setSongRating = (payload) => ({
  type: SET_SONG_RATING,
  payload,
});

export const deleteSongs = (ids) => ({
  type: DELETE_SONGS,
  payload: ids,
});

export const getSongsThunk = (page, limit) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));

    const { data } = await axiosInstance.get(API.get, {
      params: { page, limit },
    });

    const { data: allSongs } = await axiosInstance.get(API.get);

    dispatch(getAllSongsCount(allSongs.length));

    dispatch(getSongs(data));
  } catch (error) {
    toast.error(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const getSongThunk = (songId) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));

    const { data } = await axiosInstance.get(`${API.getDetails}/${songId}`);

    dispatch(getSong(data));
  } catch (error) {
    toast.error(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const addSongThunk = (song) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));
    const {
      data: { url },
    } = await axiosFileInstance.post(API.postPhoto, song.photo);

    await axiosInstance.post(API.post, {
      name: song.song,
      band: song.band,
      details: song.details,
      photo: url,
      location: song.country + ' ' + song.city,
      rating: 0,
    });

    toast.success('The song has been added!');
  } catch (error) {
    toast.error(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const updateSongThunk = (id, song) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));

    let photo = song.photo;

    if (song.photo instanceof FormData) {
      const {
        data: { url },
      } = await axiosFileInstance.post(API.postPhoto, song.photo);

      photo = url;
    }

    await axiosInstance.put(`${API.update}/${id}`, {
      name: song.song,
      band: song.band,
      details: song.details,
      photo,
      location: `${song.country} ${song.city}`.trim(),
    });

    toast.success(`Updated "${song.song}".`);
  } catch (error) {
    toast.error(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const setSongRatingThunk =
  (id, rating, songName) => async (dispatch) => {
    try {
      dispatch(setIsLoading(true));

      await axiosInstance.put(`${API.update}/${id}`, {
        rating,
      });

      dispatch(setSongRating({ id, rating }));

      toast.success(`Rating ${rating}/5 set for "${songName}".`);
    } catch (error) {
      toast(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

export const deleteSongsThunk = (songsOrIds) => async (dispatch) => {
  const songs = songsOrIds.map((songOrId) =>
    typeof songOrId === 'object' ? songOrId : { id: songOrId }
  );
  const ids = songs.map((song) => song.id);
  const songNames = songs.map((song) => song.name || `#${song.id}`);

  try {
    dispatch(setIsLoading(true));

    await Promise.all(
      ids.map((rowId) => axiosInstance.delete(`${API.delete}/${rowId}`))
    );

    dispatch(deleteSongs(ids));

    toast.success(`Deleted: ${songNames.join(', ')}.`);
  } catch (error) {
    toast.error(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};
