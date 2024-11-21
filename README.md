# Jean Test Mobile Submission

This repository contains the submission of the React Native hiring test as well as bootstrapping information to run the app

## Feature improvement
 ### Customer list/management and their invoices
 - As a user I would want to be able to see a list of my customers and also see the invoices attached to them, as this will be easier in terms of quickly fetching information about my customers
 - It would also be helpful to be able to just create an invoice from a customer information screen where the customer will already be preselected on the invoice screen
 - An endpoint to get all customers would be beneficial, currently only one to search for customers exist.

 ### Invoice reminders/notifications
 - This would help to follow up with customers on their invoices especially when the due dates are getting close
 - It will ensure timely payments by reducing the risk of forgetting or neglecting overdue invoices

 ### Exporting Invoices
 - This would help in sharing the invoices with client, either directly to email or via social media messaging.
 I thought about this because I realized there was no way to export the invoices at the moment.

 ### Invoice Frequency and Recurrence
 - As a user, I could have an ongoing contract with a customer with preset information, this would help save time for businesses such that they don't have to keep recreatign the same invoice everytime they need it.

## Feature Tech improvement
  ### Invoice creation
  When creating an invoice, The text fields for the invoice line item can be simplified to just search for the product Id and prefill every other field automatically

  ### Error handling
  To properly handle errors, especially errors from api requests or form feedback so the user is aware of why they're not able to continue with what they're doing

## Blockers
  - I could not create an invoice with line attributes, but I could create without line items. I would really appreciate feedback on what i was doing wrong here
  - Some Invoices could not be Deleted. I would also like some feedback here on why that was happening
  I kept getting a 422 error for both requests


## Debugging
  - If you stumble on this error about Flipper "Called object type 'facebook::flipper::SocketCertificateProvider' is not a function or function pointer." -> https://stackoverflow.com/q/78121217
  - The solution is to do this -> https://stackoverflow.com/a/78122323



## Your mission

> ***Implement an invoicing app with React Native***

### Objectives

The goal is to leverage an existing REST HTTP API to build the prototype of an invoicing app.

This prototype allows users to perform simple actions around their invoices:
- List existing invoices with relevant details
- Create new invoices
- Manage existing invoices
  - Finalize invoices
  - Delete invoices

We do not expect the prototype to be feature-rich as we'll mainly focus on code quality, performance & user experience.
We expect you to adopt standard coding practices & setup, including testing, as if you were working on a real application with other coworkers.

Feel free to use pre-installed dependencies or add new ones if you have a legitimate use of them.

Please take the time to identify advanced features that could be added in the future & write down tech improvements/ideas you could work on.

For each feature/tech improvement, we want to understand:
- What led you to think about this
- Why it would be useful
- What might be missing for you to implement it (API limitations, technical constraints)

### Deliverable

- Create a private GitHub repository containing the source code of your application
- Invite the following GitHub users to it: `@julienpinquie` `@soyoh` `@LucaGaspa` `@greeeg` 

## What you're working with

Please note that we rely on [`asdf`](https://github.com/asdf-vm/asdf) to manage Ruby/Node/Yarn versions. Feel free to use something else & have a look at `.tool-versions` if you run in any trouble.

### Getting started

```sh
git clone git@github.com:pennylane-hq/jean_test_mobile.git

cd jean_test_mobile

bin/pull

# Make sure to add your token (sent by email)
cp .env.example .env

yarn start

yarn ios
```

### Data model

The REST API contains 4 resources: customers, products, invoices & invoice lines.

Side notes:
- Invoices contain multiple invoice lines.
- Invoice lines are accessed via their invoice. To update them, use the relevant invoice API endpoints.
- Once the `finalized` field is set to `true` for invoices, no field may be modified except for `paid`.

The REST API base URL is `https://jean-test-api.herokuapp.com/`.
Each API call must be authenticated using a `X-SESSION` header with the provided token.

An OpenAPI definition for this REST API is avaible [here](https://jean-test-api.herokuapp.com/api-docs/index.html).

The invoices list endpoint supports a `filter` query param which can be used as described in [our external API documentation](https://pennylane.readme.io/docs/how-to-set-up-filters).

### API client

An API client based on `openapi-client-axios` is available through a React Context set up in `src/api/index.tsx`. The provider is mounted in `src/App.tsx` & the context can be consumed using the `useApi` hook from `src/api/index.tsx`.

```tsx
const MyComponent = () => {
  const apiClient = useApi()

  useEffect(() => {
    apiClient.getInvoices().then(res => {
      // Do something...
    })
  }, [apiClient])

  return null
}
```
