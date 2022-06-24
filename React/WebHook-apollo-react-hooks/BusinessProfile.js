/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useDropzone } from 'react-dropzone';
import Card from './Card';
import Input, { AddressInput } from './Input';
import { GET_CURRENT_ORGANIZATION, UPDATE_ORGANIZATION_INFO, UPLOAD_FILES } from '../graphql/queries';
import Loader from './Loader';
import colors from '../styles/colors';
import Button from './Button';

const LoaderContainer = styled.div`
  position: absolute;
  top: calc(50vh - 60px);
  left: calc(50vw - 60px);
`;

const Form = styled.form``;

const Image = styled.div`
  margin-top: 30px;
  background-image: ${(props) => `url(${props.src})`};
  background-size: cover;
  background-position: center;
  background-origin: unset;
  border-radius: ${(props) => props.radius || '5px'};
  height: 190px;
  width: 300px;
`;

const Logo = styled.div`
  margin-top: 30px;
  max-width: 100px;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${colors.grey5};
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ImageContainer = styled.img`
  width: 100%;
  height: auto;
`;

const DropzoneText = styled.div`
  margin-top: 15px;
  font-weight: 500;
  font-size: 1.2rem;
  color: ${colors.seaGreen};
  text-decoration: underline;
  cursor: pointer;
`;

const DropzoneContainer = styled.div`
  width: fit-content;
`;

export default function BusinessProfile() {
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [posterImageUrl, setPosterImageUrl] = useState('');
  const [isLogoUpload, setIsLogoUpload] = useState(false);
  const [isPosterUpload, setIsPosterUpload] = useState(false);
  const { data, loading } = useQuery(GET_CURRENT_ORGANIZATION);
  const [uploadFiles] = useMutation(UPLOAD_FILES, {
    onError(error) {
      console.log(error);
    },
    onCompleted(data) {
      console.log(data);
      if (isLogoUpload) {
        setLogoUrl(data.uploadFiles[0].url);
        setIsLogoUpload(false);
      }
      if (isPosterUpload) {
        setPosterImageUrl(data.uploadFiles[0].url);
        setIsPosterUpload(false);
      }
    },
  });
  const [updateOrganizationInfo, { loading: updateLoading }] = useMutation(UPDATE_ORGANIZATION_INFO, {
    variables: {
      name,
      address: {
        address1,
        address2,
        city,
        state,
        zip,
      },
      logoUrl,
      posterImageUrl,
    },
    onError(error) {
      console.log(error);
    },
    onCompleted(data) {
      console.log(data);
    },
  });
  const onDrop = React.useCallback((acceptedFiles) => {
    uploadFiles({
      variables: {
        files: acceptedFiles,
      },
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/jpeg, image/png' });
  useEffect(() => {
    if (data && data.getCurrentOrganization) {
      const {
        getCurrentOrganization,
        getCurrentOrganization: { address },
      } = data;

      setName(getCurrentOrganization.name);
      setLogoUrl(getCurrentOrganization.logoUrl);
      setPosterImageUrl(getCurrentOrganization.posterImageUrl);
      setAddress1(address.address1);
      setAddress2(address.address2);
      setCity(address.city);
      setState(address.state);
      setZip(address.zip);
    }
  }, [data]);

  if (loading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        updateOrganizationInfo();
      }}
    >
      <Card>
        <Input
          top
          header="BUSINESS NAME"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <AddressInput
          header="ADDRESS"
          address1Value={address1}
          address1OnChange={(e) => setAddress1(e.target.value)}
          address2Value={address2}
          address2OnChange={(e) => setAddress2(e.target.value)}
          cityValue={city}
          cityOnChange={(e) => setCity(e.target.value)}
          stateValue={state}
          stateOnChange={(e) => setState(e.target.value)}
          zipValue={zip}
          zipOnChange={(e) => setZip(e.target.value)}
        />
        <Logo>
          <ImageContainer src={logoUrl} />
        </Logo>
        <DropzoneContainer
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <DropzoneText onClick={() => {
            setIsLogoUpload(true);
            setIsPosterUpload(false);
          }}
          >
            Change Logo
          </DropzoneText>
        </DropzoneContainer>
        <Image
          src={posterImageUrl}
        />
        <DropzoneContainer
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <DropzoneText onClick={() => {
            setIsLogoUpload(false);
            setIsPosterUpload(true);
          }}
          >Change Poster Image
          </DropzoneText>
        </DropzoneContainer>
      </Card>
      <Button
        margin="40px 0px"
        text="UPDATE BUSINESS PROFILE"
        type="submit"
        width="fit-content"
        loading={updateLoading}
      />
    </Form>
  );
}
