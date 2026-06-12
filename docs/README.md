erDiagram

&#x20;   AUTH\_USERS ||--|| profiles : "1:1 (id)"

&#x20;   profiles ||--o{ wishlists : "1:N (user\_id)"

&#x20;   offers ||--o{ wishlists : "1:N (offer\_id)"

&#x20;   offers ||--o{ price\_history : "1:N (offer\_id)"

&#x20;   profiles ||--o{ linked\_accounts : "1:N (user\_id)"

&#x20;   profiles ||--o{ notifications : "1:N (user\_id)"

&#x20;   offers ||--o{ notifications : "1:N (offer\_id)"



&#x20;   profiles {

&#x20;       uuid id PK "Referencia auth.users"

&#x20;       text username

&#x20;       text full\_name

&#x20;       text avatar\_url

&#x20;       text email

&#x20;       timestamp updated\_at

&#x20;   }



&#x20;   offers {

&#x20;       uuid id PK

&#x20;       text title

&#x20;       text image\_url

&#x20;       text platform

&#x20;       text store

&#x20;       numeric current\_price

&#x20;       numeric original\_price

&#x20;       integer discount\_percent

&#x20;       boolean is\_lowest\_price

&#x20;       boolean is\_new\_offer

&#x20;       timestamp created\_at

&#x20;       timestamp updated\_at

&#x20;   }



&#x20;   wishlists {

&#x20;       uuid id PK

&#x20;       uuid user\_id FK

&#x20;       uuid offer\_id FK

&#x20;       timestamp added\_at

&#x20;   }



&#x20;   price\_history {

&#x20;       uuid id PK

&#x20;       uuid offer\_id FK

&#x20;       numeric price

&#x20;       timestamp recorded\_at

&#x20;   }



&#x20;   linked\_accounts {

&#x20;       uuid id PK

&#x20;       uuid user\_id FK

&#x20;       text platform

&#x20;       text platform\_user\_id

&#x20;       boolean connected

&#x20;       timestamp connected\_at

&#x20;   }



&#x20;   notifications {

&#x20;       uuid id PK

&#x20;       uuid user\_id FK

&#x20;       uuid offer\_id FK

&#x20;       text type

&#x20;       text message

&#x20;       boolean is\_read

&#x20;       timestamp created\_at

&#x20;   }

