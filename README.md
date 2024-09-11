# School Referral System

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Clone this repository:

```
git clone https://github.com/Stanislavstranger/school-referral-system.git
```
## Navigate to the project directory:

```
cd school-referral-system
```

## Installing NPM modules

```
npm install
```

## Running application

```
docker-compose up
```
or

```
npm run docker:start
```
or

```
make run
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/api/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Run test

```bash
# unit tests
npm run test

# test coverage
npm run test:cov
```

## Stop application

```
docker-compose down
```
or

```
npm run docker:stop
```
or

```
make stop
```

## Running application and Stop application with using `Makefile`

You can also use a `Makefile` to avoid typing long commands


### Auto-fix and format

```
npm run lint
```

```
npm run format
```

## Usage:

### Signup:

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/register?referralCode=${referralCode}` - Register a new user with a referral code.

### Login:

- `POST /api/auth/login` - Login with email and password to receive an access token.


### User:

- `GET /api/user` - Get all users.
- `GET /api/user/:id` - Get a single user by ID (ex. “/api/user/123”)
- `DELETE /api/user/:id` - Delete a user (ex. “/api/user/123”)

### Payment:

- `POST /api/payments` - Add new payment.

### Statistic:

- `GET /api/statistics/referral` - Get referral program statistics.

### Metrics:

- `GET /api/metrics` - Get metrics related to the referral program.

### Docs:

- `GET /api` - Get docs.

## Data Format

All requests and responses should be in JSON format.

## Validation

Incoming requests are validated to ensure data integrity and consistency.