create table children (
  id uuid primary key default uuid_generate_v4(),
  name text,
  class text,
  age int,
  created_at timestamp default now()
);

create table concepts (
  id uuid primary key default uuid_generate_v4(),
  name text,
  subject text,
  created_at timestamp default now()
);

create table learning_states (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id),
  concept_id uuid references concepts(id),
  understanding_score int,
  last_learned_at timestamp,
  next_revision_at timestamp,
  status text
);

create table sessions (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid,
  concept_id uuid,
  duration int,
  accuracy int,
  created_at timestamp default now()
);