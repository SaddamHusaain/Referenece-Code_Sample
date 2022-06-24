import React from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import * as Polished from 'polished';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CREATE_STRIPE_CUSTOMER } from '../graphql/queries';
import Button from './Button';
import colors from '../styles/colors';
import Icon from './Icon';
import { IconEnum as Icons } from './Icons';
import { getErrorMessage } from '../util/ErrorUtil';

const Container = styled.div`
  position: relative;
  background-color: ${colors.white};
  overflow: hidden;

  .Element {
    margin: 0;
    max-width: 100%;
    flex: 1 0 auto;
    outline: 0;
    text-align: left;
    line-height: 1.21428571em;
    background: #fff;
    border-radius: 10px;
    transition: box-shadow 0.1s ease, border-color 0.1s ease;
    box-shadow: none;
    font-size: 14px;
    margin-top: 5px;
    padding: 1.4rem;
    padding-left: 3.7rem;
    height: 17px;
  }
`;

const Form = styled.form`
  /* display: flex; */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  flex: 1;
`;

const Spacer = styled.div`
  flex: 0.075;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 15px;
`;

const ElementContainer = styled.div`
  position: relative;
  flex: 1;

  .Element {
    border: 1px solid
      ${(props) => {
    if (props.focused) return colors.grey4;
    return colors.grey5;
  }};

    &:hover {
      border: 1px solid
        ${(props) => {
    if (props.focused) return colors.grey4;
    return Polished.darken(0.05, colors.grey5);
  }};
    }
  }
`;

const ElementsEnum = Object.freeze({
  CardNumber: 'CardNumber',
  CVC: 'CVC',
  ExpDate: 'ExpDate',
});

export default function EnterPayment({ close, onCompleted, setError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [focused, setFocus] = React.useState(null);
  const [createStripeCustomer, { loading }] = useMutation(CREATE_STRIPE_CUSTOMER, {
    onError(error) {
      console.log(error);
      setError(getErrorMessage(error));
    },
    onCompleted(data) {
      if (onCompleted) {
        onCompleted();
      } else {
        close();
      }
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      console.log('[error]', error);
      setError(error.message);
    } else {
      createStripeCustomer({
        variables: {
          cardToken: token.id,
        },
      });
    }
  };

  const style = {
    base: {
      fontSize: '14px',
      fontWeight: '500',
      // height: "40px",
      color: colors.grey1,
      fontSmoothing: 'antialiased',
      fontFamily: 'Poppins',
      '::placeholder': {
        color: colors.grey4,
      },
      ':focus': {},
    },
    invalid: {
      color: colors.red,
    },
  };

  const isFocused = (field) => field === focused;

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <ElementContainer focused={isFocused(ElementsEnum.CardNumber)}>
            <IconContainer>
              <Icon
                icon={Icons.CreditCardFront}
                size={14}
                active
                activeColor={colors.grey2}
              />
            </IconContainer>
            <CardNumberElement
              className="Element"
              options={{ style, placeholder: 'Card Number' }}
              onFocus={() => setFocus(ElementsEnum.CardNumber)}
              onBlur={() => setFocus(null)}
            />
          </ElementContainer>
        </Row>
        <Row>
          <ElementContainer focused={isFocused(ElementsEnum.CVC)}>
            <IconContainer>
              <Icon
                icon={Icons.CreditCardBack}
                size={14}
                active
                activeColor={colors.grey2}
              />
            </IconContainer>
            <CardCvcElement
              className="Element"
              options={{ style, placeholder: 'CVC' }}
              onFocus={() => setFocus(ElementsEnum.CVC)}
              onBlur={() => setFocus(null)}
            />
          </ElementContainer>
          <Spacer />
          <ElementContainer focused={isFocused(ElementsEnum.ExpDate)}>
            <IconContainer>
              <Icon
                icon={Icons.Calendar}
                size={14}
                active
                activeColor={colors.grey2}
              />
            </IconContainer>
            <CardExpiryElement
              className="Element"
              options={{ style, placeholder: 'Exp. Date' }}
              onFocus={() => setFocus(ElementsEnum.ExpDate)}
              onBlur={() => setFocus(null)}
            />
          </ElementContainer>
        </Row>
        <Button
          margin="20px 0px 0px 0px"
          text="CONFIRM"
          width="100%"
          type="submit"
          loading={loading}
        />
      </Form>
    </Container>
  );
}
