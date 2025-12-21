'use server';

export async function submitAction(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  console.log('Submitting login form with data:', data);
}
