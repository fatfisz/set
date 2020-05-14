import axios from 'axios';

let anonymousCount = 0;

export async function getRandomName() {
  try {
    const response = await axios.get('http://names.drycodes.com/1', {
      params: {
        separator: 'space',
        format: 'text',
      },
    });

    if (response.status !== 200) {
      throw Object.assign(new Error('Could not get the name'), { response });
    }

    return response.data as string;
  } catch (error) {
    console.error(error);
    anonymousCount += 1;
    return `Anonymous ${anonymousCount}`;
  }
}
