--
-- PostgreSQL database dump
--

\restrict 32aSOp6gfz5Kb7poAz3N4agh2gqKE06GWY9E69zd52gLtt3nFjZeJO9DarpCKeY

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: currentstate; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.currentstate AS ENUM (
    'active',
    'trash',
    'not_current_rev',
    'missing',
    'inventory'
);


ALTER TYPE public.currentstate OWNER TO postgres;

--
-- Name: die_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.die_status AS ENUM (
    'in_production',
    'serviced',
    'not_serviced'
);


ALTER TYPE public.die_status OWNER TO postgres;

--
-- Name: diestatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.diestatus AS ENUM (
    'in_production',
    'serveiced',
    'not_serveiced'
);


ALTER TYPE public.diestatus OWNER TO postgres;

--
-- Name: jobtitle; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.jobtitle AS ENUM (
    'press_tech',
    'tool_maker',
    'engineer',
    'tool_manager',
    'admin'
);


ALTER TYPE public.jobtitle OWNER TO postgres;

--
-- Name: status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status AS ENUM (
    'inventory',
    'trash',
    'not_current_rev',
    'missing',
    'active'
);


ALTER TYPE public.status OWNER TO postgres;

--
-- Name: title; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.title AS ENUM (
    'press_tech',
    'tool_maker',
    'engineer',
    'tool_manager',
    'admin'
);


ALTER TYPE public.title OWNER TO postgres;

--
-- Name: set_default_height(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_default_height() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin select nominal_height into NEW.current_height from component_details where tool_number = NEW.tool_number and detail_number = NEW.detail_number ; return new; end; $$;


ALTER FUNCTION public.set_default_height() OWNER TO postgres;

--
-- Name: set_default_revision(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_default_revision() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ begin select current_revision into NEW.revision from component_details where tool_Number = NEW.tool_number and detail_number = NEW.detail_number; RETURN NEW; END; $$;


ALTER FUNCTION public.set_default_revision() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: component_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.component_details (
    tool_number character varying(50) NOT NULL,
    detail_number character varying(50) NOT NULL,
    min_height real DEFAULT 0,
    nominal_height real NOT NULL,
    low_quantity integer DEFAULT 0,
    frequency_to_sharpen integer DEFAULT 200000,
    description text,
    number_used_in_tool integer NOT NULL,
    cost real DEFAULT 0.00,
    current_revision integer DEFAULT 0
);


ALTER TABLE public.component_details OWNER TO postgres;

--
-- Name: components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.components (
    tool_number character varying(50) NOT NULL,
    detail_number character varying(50) NOT NULL,
    build_number character varying(50) NOT NULL,
    component_number integer NOT NULL,
    revision integer,
    lifetime_hits integer DEFAULT 0,
    current_hits integer DEFAULT 0,
    current_height real,
    current_state public.status DEFAULT 'inventory'::public.status
);


ALTER TABLE public.components OWNER TO postgres;

--
-- Name: deleted_components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deleted_components (
    tool_number character varying(50) NOT NULL,
    detail_number character varying(50) NOT NULL,
    build_number character varying(50) NOT NULL,
    component_number integer NOT NULL,
    revision_number integer,
    lifetime_number_of_hits integer
);


ALTER TABLE public.deleted_components OWNER TO postgres;

--
-- Name: dies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dies (
    tool_number character varying(50) NOT NULL,
    punch_depth real,
    material_thickness real,
    company character varying(50) NOT NULL,
    status public.die_status DEFAULT 'serviced'::public.die_status NOT NULL
);


ALTER TABLE public.dies OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    employee_id integer NOT NULL,
    first_name character varying(20),
    last_name character varying(20),
    password character varying(200),
    employed boolean DEFAULT true,
    job_title public.title DEFAULT 'press_tech'::public.title NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: insert_component; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insert_component (
    operation_id bigint NOT NULL,
    tool_number character varying(50) NOT NULL,
    detail_number character varying(50) NOT NULL,
    build_number character varying(50) NOT NULL,
    component_number integer NOT NULL
);


ALTER TABLE public.insert_component OWNER TO postgres;

--
-- Name: insert_component_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insert_component_details (
    operation_id bigint NOT NULL,
    tool_number character varying(50),
    detail_number character varying(50)
);


ALTER TABLE public.insert_component_details OWNER TO postgres;

--
-- Name: operations_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.operations_log (
    operation_id bigint NOT NULL,
    employee_id integer,
    date timestamp without time zone
);


ALTER TABLE public.operations_log OWNER TO postgres;

--
-- Name: operations_log_operation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.operations_log ALTER COLUMN operation_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.operations_log_operation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: update_component_current_height; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.update_component_current_height (
    operation_id bigint NOT NULL,
    tool_number character varying(50) NOT NULL,
    detail_number character varying(50) NOT NULL,
    build_number character varying(50) NOT NULL,
    component_number integer NOT NULL,
    old_height real NOT NULL,
    new_height real NOT NULL
);


ALTER TABLE public.update_component_current_height OWNER TO postgres;

--
-- Name: update_component_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.update_component_details (
    operation_id bigint NOT NULL,
    tool_number character varying(50) NOT NULL,
    detail_number character varying(50) NOT NULL,
    old_min_height real,
    old_nominal_height real,
    old_low_quantity integer,
    old_frequency_to_sharpen integer,
    old_description text,
    old_number_used_in_tool integer,
    old_cost real,
    old_current_revision integer,
    new_min_height real,
    new_nominal_height real,
    new_low_quantity integer,
    new_frequency_to_sharpen integer,
    new_description text,
    new_number_used_in_tool integer,
    new_cost real,
    new_current_revision integer
);


ALTER TABLE public.update_component_details OWNER TO postgres;

--
-- Name: update_component_revision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.update_component_revision (
    operation_id bigint NOT NULL,
    tool_number character varying(50) NOT NULL,
    detail_number character varying(50) NOT NULL,
    build_number character varying(50) NOT NULL,
    component_number integer NOT NULL,
    old_revision integer NOT NULL,
    new_revision integer NOT NULL
);


ALTER TABLE public.update_component_revision OWNER TO postgres;

--
-- Name: update_component_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.update_component_state (
    operation_id bigint NOT NULL,
    tool_number character varying(50) NOT NULL,
    detail_number character varying(50) NOT NULL,
    build_number character varying(50) NOT NULL,
    component_number integer NOT NULL,
    old_state public.status,
    new_state public.status,
    description text
);


ALTER TABLE public.update_component_state OWNER TO postgres;

--
-- Name: component_details component_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_details
    ADD CONSTRAINT component_details_pkey PRIMARY KEY (tool_number, detail_number);


--
-- Name: components components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_pkey PRIMARY KEY (tool_number, detail_number, build_number, component_number);


--
-- Name: deleted_components deleted_components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deleted_components
    ADD CONSTRAINT deleted_components_pkey PRIMARY KEY (tool_number, detail_number, build_number, component_number);


--
-- Name: dies dies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dies
    ADD CONSTRAINT dies_pkey PRIMARY KEY (tool_number);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- Name: insert_component_details insert_component_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insert_component_details
    ADD CONSTRAINT insert_component_details_pkey PRIMARY KEY (operation_id);


--
-- Name: insert_component insert_component_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insert_component
    ADD CONSTRAINT insert_component_pkey PRIMARY KEY (operation_id);


--
-- Name: operations_log operations_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operations_log
    ADD CONSTRAINT operations_log_pkey PRIMARY KEY (operation_id);


--
-- Name: update_component_current_height update_component_current_height_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_current_height
    ADD CONSTRAINT update_component_current_height_pkey PRIMARY KEY (operation_id);


--
-- Name: update_component_details update_component_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_details
    ADD CONSTRAINT update_component_details_pkey PRIMARY KEY (operation_id);


--
-- Name: update_component_revision update_components_revision_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_revision
    ADD CONSTRAINT update_components_revision_pkey PRIMARY KEY (operation_id);


--
-- Name: update_component_state update_components_state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_state
    ADD CONSTRAINT update_components_state_pkey PRIMARY KEY (operation_id);


--
-- Name: components set_current_height_default; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_current_height_default BEFORE INSERT ON public.components FOR EACH ROW EXECUTE FUNCTION public.set_default_height();


--
-- Name: components set_current_revision_default; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_current_revision_default BEFORE INSERT ON public.components FOR EACH ROW EXECUTE FUNCTION public.set_default_revision();


--
-- Name: insert_component_details component_details_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insert_component_details
    ADD CONSTRAINT component_details_fkey FOREIGN KEY (tool_number, detail_number) REFERENCES public.component_details(tool_number, detail_number) ON DELETE CASCADE;


--
-- Name: update_component_details component_details_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_details
    ADD CONSTRAINT component_details_fkey FOREIGN KEY (tool_number, detail_number) REFERENCES public.component_details(tool_number, detail_number);


--
-- Name: deleted_components component_details_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deleted_components
    ADD CONSTRAINT component_details_fkey FOREIGN KEY (tool_number, detail_number) REFERENCES public.component_details(tool_number, detail_number);


--
-- Name: component_details component_details_tool_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_details
    ADD CONSTRAINT component_details_tool_number_fkey FOREIGN KEY (tool_number) REFERENCES public.dies(tool_number);


--
-- Name: update_component_current_height components_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_current_height
    ADD CONSTRAINT components_fkey FOREIGN KEY (tool_number, detail_number, build_number, component_number) REFERENCES public.components(tool_number, detail_number, build_number, component_number) ON DELETE CASCADE;


--
-- Name: insert_component components_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insert_component
    ADD CONSTRAINT components_fkey FOREIGN KEY (tool_number, detail_number, build_number, component_number) REFERENCES public.components(tool_number, detail_number, build_number, component_number) ON DELETE CASCADE;


--
-- Name: update_component_state components_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_state
    ADD CONSTRAINT components_fkey FOREIGN KEY (tool_number, detail_number, build_number, component_number) REFERENCES public.components(tool_number, detail_number, build_number, component_number) ON DELETE CASCADE;


--
-- Name: update_component_revision components_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_revision
    ADD CONSTRAINT components_fkey FOREIGN KEY (tool_number, detail_number, build_number, component_number) REFERENCES public.components(tool_number, detail_number, build_number, component_number) ON DELETE CASCADE;


--
-- Name: components components_tool_number_detail_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_tool_number_detail_number_fkey FOREIGN KEY (tool_number, detail_number) REFERENCES public.component_details(tool_number, detail_number);


--
-- Name: insert_component_details operation_log_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insert_component_details
    ADD CONSTRAINT operation_log_fkey FOREIGN KEY (operation_id) REFERENCES public.operations_log(operation_id);


--
-- Name: update_component_details operation_log_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_details
    ADD CONSTRAINT operation_log_fkey FOREIGN KEY (tool_number, detail_number) REFERENCES public.component_details(tool_number, detail_number) ON DELETE CASCADE;


--
-- Name: operations_log operations_log_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operations_log
    ADD CONSTRAINT operations_log_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id);


--
-- Name: update_component_current_height operations_log_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_current_height
    ADD CONSTRAINT operations_log_fkey FOREIGN KEY (operation_id) REFERENCES public.operations_log(operation_id);


--
-- Name: insert_component operations_log_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insert_component
    ADD CONSTRAINT operations_log_fkey FOREIGN KEY (operation_id) REFERENCES public.operations_log(operation_id);


--
-- Name: update_component_state operations_log_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_state
    ADD CONSTRAINT operations_log_fkey FOREIGN KEY (operation_id) REFERENCES public.operations_log(operation_id);


--
-- Name: update_component_revision operations_log_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_component_revision
    ADD CONSTRAINT operations_log_fkey FOREIGN KEY (operation_id) REFERENCES public.operations_log(operation_id);


--
-- Name: TABLE component_details; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.component_details TO press_tech;


--
-- Name: TABLE components; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,UPDATE ON TABLE public.components TO press_tech;
GRANT UPDATE ON TABLE public.components TO toolmanager;


--
-- Name: TABLE deleted_components; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.deleted_components TO press_tech;
GRANT UPDATE ON TABLE public.deleted_components TO toolmanager;


--
-- Name: TABLE dies; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,UPDATE ON TABLE public.dies TO press_tech;


--
-- Name: TABLE employees; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.employees TO press_tech;


--
-- Name: TABLE insert_component; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.insert_component TO press_tech;
GRANT UPDATE ON TABLE public.insert_component TO toolmanager;


--
-- Name: TABLE insert_component_details; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.insert_component_details TO press_tech;
GRANT UPDATE ON TABLE public.insert_component_details TO engineer;


--
-- Name: TABLE operations_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,UPDATE ON TABLE public.operations_log TO press_tech;


--
-- Name: TABLE update_component_current_height; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.update_component_current_height TO press_tech;
GRANT UPDATE ON TABLE public.update_component_current_height TO toolmaker;


--
-- Name: TABLE update_component_details; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.update_component_details TO press_tech;


--
-- Name: TABLE update_component_revision; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.update_component_revision TO press_tech;
GRANT UPDATE ON TABLE public.update_component_revision TO toolmaker;


--
-- Name: TABLE update_component_state; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,UPDATE ON TABLE public.update_component_state TO press_tech;


--
-- PostgreSQL database dump complete
--

\unrestrict 32aSOp6gfz5Kb7poAz3N4agh2gqKE06GWY9E69zd52gLtt3nFjZeJO9DarpCKeY

