import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';



test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    // Arrange
    render(<ContactForm />);

    // Act
    const header = screen.getByText('Contact Form');
    const headerElement = screen.queryByText(/Contact Form/i)

    // Assert
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/Contact Form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);

    const firstNameField = screen.getByText(/First Name*/i);
    userEvent.type(firstNameField, 'adfd');

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessages = screen.queryAllByTestId("error");
        expect(errorMessages).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField, 'abcdefg');

    const lastNameField = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameField, 'hijkl');

    const button = screen.getByRole('button');
    userEvent.click(button);

    const errorMessage = await screen.findAllByTestId('error');
    expect(errorMessage).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, 'asdfdf@gmail');

    const errorMessage = await screen.findByText(/ email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstNameField = screen.getByText(/first name*/i);
    userEvent.type(firstNameField, "adfdd");

    const lastNameField = screen.getByText(/last name*/i);
    userEvent.type(lastNameField, 'Berlin');

    const emailField = screen.getByText(/email*/i);
    userEvent.type(emailField, 'asdf@gmail.com');

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(() => {
        const firstnameDisplay = screen.queryByText("adfdd");
        const lastnameDisplay = screen.queryByText("Berlin");
        const emailDisplay = screen.queryByText("asdf@gmail.com");
        const messageDisplay = screen.queryByTestId('messageDisplay');

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstNameField = screen.getByLabelText(/first name*/i);
    const lastNameField = screen.getByLabelText(/last name*/i);
    const emailField = screen.getByLabelText(/email*/i);
    const messageFiled = screen.getByLabelText(/message/i);

    userEvent.type(firstNameField, "Daehanminkuk");
    userEvent.type(lastNameField, "Korea");
    userEvent.type(emailField, "korea@gmail.com");
    userEvent.type(messageFiled, "messageDisplay")


    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);



    await waitFor(() => {
        const firstnameDisplay = screen.queryByText("Daehanminkuk");
        const lastnameDisplay = screen.queryByText("Korea");
        const emailDisplay = screen.queryByText("korea@gmail.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })

});
