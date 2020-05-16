import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useCallback, useMemo } from 'react';

import { SocketContext } from 'components/SocketContext';
import { translucentBlack } from 'config/colors';

interface Values {
  autoAddCard: boolean;
  name: string;
}

export default function RoomCreate() {
  const router = useRouter();
  const { createRoom } = useContext(SocketContext);
  const initialValues = useInitialValues();
  const submit = useCallback((values: Values) => {
    createRoom(values);
    router.push('/');
  }, []);
  return (
    <>
      <div className="spacing-wrapper">
        <Formik<Values>
          enableReinitialize
          initialValues={initialValues}
          onSubmit={submit}
        >
          <Form className="create-room-form">
            <h1>Create room</h1>
            <label>
              Room name
              <Field name="name" />
            </label>
            <label>
              <Field type="checkbox" name="autoAddCard" />
              Automatically add a card when there is no set on the table
            </label>

            <button type="submit">Create</button>
          </Form>
        </Formik>
      </div>

      <style jsx>{`
        .spacing-wrapper {
          align-items: center;
          display: flex;
          flex-direction: column;
          padding: 64px 0;
        }

        .create-room-form {
          background-color: ${translucentBlack};
          border-radius: 32px;
          padding: 32px;
          min-height: 420px;
          width: 500px;
        }
      `}</style>
    </>
  );
}

function useInitialValues() {
  const { name } = useContext(SocketContext);
  return useMemo(
    () => ({
      name: `${name}'s room`,
      autoAddCard: true,
    }),
    [name]
  );
}
