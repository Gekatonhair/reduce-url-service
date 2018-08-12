# Umbrella project
It's a service to reduce url-links. Front-end is developed on a Node.js. The database - postgreSQL.
***

# Before started
you need:
  1. Download and install [node.js](https://nodejs.org/en/download/);
  2. Download and install [PostgreSQL](https://www.openscg.com/bigsql/postgresql/installers.jsp/);
  3. Expand data base structure;
  
  3.1 Table "users" and sequence for it:
~~~~sql
CREATE SEQUENCE public.users_id_seq;

ALTER SEQUENCE public.users_id_seq
    OWNER TO postgres;

CREATE TABLE public.users
(
    login character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;
~~~~
 3.2 Table 'users' and sequence for it:
 ~~~~sql
 CREATE SEQUENCE public.urldata_id_seq;
 
 CREATE TABLE public.urldata
(
    id integer NOT NULL DEFAULT nextval('urldata_id_seq'::regclass),
    url character varying(2048) COLLATE pg_catalog."default",
    "shortUrl" character varying(2048) COLLATE pg_catalog."default",
    "shortUrlUsageCount" integer NOT NULL DEFAULT 0,
    "createDate" date,
    CONSTRAINT urldata_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.urldata
    OWNER to postgres;

COMMENT ON COLUMN public.urldata.url
    IS 'ограничен для ie';
~~~~
  3.3 table "session" and sequence for it:
~~~~sql
CREATE TABLE public.session
(
    sid character varying COLLATE pg_catalog."default" NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.session
    OWNER to postgres;
~~~~
  4. Edit the config file (/config/config.js);
  5. Download node npm-manager: `$ node npm i -g`;
  
  # Start
  `$ node start.js`;
  



  


