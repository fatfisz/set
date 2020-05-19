import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useCallback, useMemo } from 'react';

import { SocketContext } from 'components/SocketContext';
import { FloatingContent } from 'components/FloatingContent';

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
    <FloatingContent>
      <Formik<Values>
        enableReinitialize
        initialValues={initialValues}
        onSubmit={submit}
      >
        <Form>
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
    </FloatingContent>
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
