# Backend Routes

## User

-   GET `/api/users/check-username`
-   GET `/api/users/status`
-   POST `/api/users/send-token`
-   POST `/api/users/verify-token`
-   POST `/api/users/onboard`
-   POST `/api/users/logout`
-   GET `/api/users/google`
-   GET `/api/users/google/callback`

## Relation

-   GET `/api/relations/friends`
-   DELETE `/api/relations/friends/:relationId`

-   GET `/api/relations/requests`
-   POST `/api/relations/requests`
-   DELETE `/api/relations/requests/:relationId`
-   PATCH `/api/relations/requests/:relationId`
