import { useEffect, useReducer } from 'react';
import { InputFile } from '../../atoms/InputFile/InputFile';
import { InputText } from '../../atoms/InputText/InputText';
import { TextArea } from '../../atoms/TextArea/TextArea';
import styles from './FormPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  addSongThunk,
  getSongThunk,
  updateSongThunk,
} from '../../../store/actions';
import { useHistory, useParams } from 'react-router-dom';
import { getTargetSongSelector } from '../../../store/selectors';

const FORM_ACTION_TYPES = {
  CREATE_SONG: 'CREATE_SONG',
  CREATE_BAND: 'CREATE_BAND',
  CREATE_DETAILS: 'CREATE_DETAILS',
  ADD_PHOTO: 'ADD_PHOTO',
  CREATE_COUNTRY: 'CREATE_COUNTRY',
  CREATE_CITY: 'CREATE_CITY',
  RESET: 'RESET',
  LOAD: 'LOAD',
};

const initFormState = {
  song: '',
  band: '',
  details: '',
  photo: '',
  country: '',
  city: '',
  photoPreview: '',
};

const reducer = (state, action) => {
  if (action.type === FORM_ACTION_TYPES.CREATE_SONG) {
    return {
      ...state,
      song: action.payload,
    };
  } else if (action.type === FORM_ACTION_TYPES.CREATE_BAND) {
    return {
      ...state,
      band: action.payload,
    };
  } else if (action.type === FORM_ACTION_TYPES.CREATE_DETAILS) {
    return {
      ...state,
      details: action.payload,
    };
  } else if (action.type === FORM_ACTION_TYPES.ADD_PHOTO) {
    return {
      ...state,
      photo: action.payload.formData,
      photoPreview: action.payload.previewUrl,
    };
  } else if (action.type === FORM_ACTION_TYPES.REMOVE_PHOTO) {
    return {
      ...state,
      photo: '',
      photoPreview: '',
    };
  } else if (action.type === FORM_ACTION_TYPES.CREATE_COUNTRY) {
    return {
      ...state,
      country: action.payload,
    };
  } else if (action.type === FORM_ACTION_TYPES.CREATE_CITY) {
    return {
      ...state,
      city: action.payload,
    };
  } else if (action.type === FORM_ACTION_TYPES.RESET) {
    return initFormState;
  } else if (action.type === FORM_ACTION_TYPES.LOAD) {
    return action.payload;
  }

  return state;
};

export const FormPage = () => {
  const [state, dispatch] = useReducer(reducer, initFormState);

  const reduxDispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const targetSong = useSelector(getTargetSongSelector);

  useEffect(() => {
    if (id) {
      reduxDispatch(getSongThunk(id));
    }
  }, [id, reduxDispatch]);

  useEffect(() => {
    if (!id || !targetSong.id || `${targetSong.id}` !== `${id}`) return;

    const [country = '', city = ''] = (targetSong.location || '').split(' ');

    dispatch({
      type: FORM_ACTION_TYPES.LOAD,
      payload: {
        song: targetSong.name,
        band: targetSong.band,
        details: targetSong.details,
        photo: targetSong.photo,
        photoPreview: targetSong.photo,
        country,
        city,
      },
    });
  }, [id, targetSong]);

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    if (id) {
      await reduxDispatch(updateSongThunk(id, state));
    } else {
      await reduxDispatch(addSongThunk(state));
    }

    dispatch({ type: FORM_ACTION_TYPES.RESET });
    history.push('/songs');
  };

  const handleChangeInput = (event) => {
    if (event.target.name === FORM_ACTION_TYPES.ADD_PHOTO) {
      const formData = new FormData();
      const file = event.target.files[0];

      if (!file) return;

      formData.append('filename', file);

      dispatch({
        type: event.target.name,
        payload: {
          formData,
          previewUrl: URL.createObjectURL(file),
        },
      });

      return;
    }

    dispatch({ type: event.target.name, payload: event.target.value });
  };

  const handleRemovePhoto = () => {
    dispatch({ type: FORM_ACTION_TYPES.REMOVE_PHOTO });
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      autoComplete="off"
      encType="multipart/form-data"
    >
      <fieldset className={styles.wrapper}>
        <legend>{id ? 'Edit item' : 'Add new item'}</legend>
        <label>
          <InputText
            title="Band name"
            name={FORM_ACTION_TYPES.CREATE_BAND}
            onChange={handleChangeInput}
            value={state.band}
            required
          />
        </label>
        <label>
          <InputText
            title="Song name"
            name={FORM_ACTION_TYPES.CREATE_SONG}
            onChange={handleChangeInput}
            value={state.song}
            required
          />
        </label>
        <label>
          <InputText
            title="Country"
            name={FORM_ACTION_TYPES.CREATE_COUNTRY}
            onChange={handleChangeInput}
            value={state.country}
            required
          />
        </label>
        <label>
          <InputText
            title="City"
            name={FORM_ACTION_TYPES.CREATE_CITY}
            onChange={handleChangeInput}
            value={state.city}
          />
        </label>
        <InputFile
          title="Add photo"
          name={FORM_ACTION_TYPES.ADD_PHOTO}
          accept="image/*"
          onChange={handleChangeInput}
          previewUrl={state.photoPreview}
          onRemove={handleRemovePhoto}
        />
        <label>
          <TextArea
            name={FORM_ACTION_TYPES.CREATE_DETAILS}
            title="Add details"
            onChange={handleChangeInput}
            value={state.details}
            required
          />
        </label>
        <button type="submit">{id ? 'Save' : 'Confirm'}</button>
      </fieldset>
    </form>
  );
};
