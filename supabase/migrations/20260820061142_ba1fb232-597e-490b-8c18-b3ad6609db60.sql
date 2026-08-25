-- ============ roles & profiles ============
create type public.app_role as enum ('admin','editor');
create type public.content_status as enum ('draft','published');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile write" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admins read roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ settings singletons ============
create table public.site_settings (
  id text primary key default 'default' check (id = 'default'),
  site_title text not null default 'The Wandering Nomads',
  site_description text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  keywords text not null default '',
  og_image_url text,
  favicon_url text,
  logo_url text,
  footer_copyright text not null default '',
  launch_status text not null default 'pre_launch' check (launch_status in ('pre_launch','live')),
  launch_at timestamptz not null default '2026-08-24T18:30:00Z',
  timezone text not null default 'Asia/Kolkata',
  contact_email text,
  contact_phone text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "site settings public read" on public.site_settings for select to anon, authenticated using (true);
create policy "site settings admin write" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger site_settings_updated before update on public.site_settings for each row execute function public.update_updated_at_column();

create table public.design_settings (
  id text primary key default 'default' check (id = 'default'),
  primary_color text not null default '#1f4032',
  accent_color text not null default '#2f6f8f',
  bg_light text not null default '#f8f6f0',
  bg_dark text not null default '#111311',
  text_light text not null default '#1a1c1a',
  text_dark text not null default '#f2f0ea',
  border_color text not null default '#dcd6c8',
  glass_opacity numeric not null default 0.6,
  glass_blur integer not null default 16,
  radius numeric not null default 0.75,
  heading_font text not null default 'Instrument Serif',
  body_font text not null default 'Inter',
  base_font_size integer not null default 16,
  animation_intensity numeric not null default 1,
  animation_speed numeric not null default 1,
  updated_at timestamptz not null default now()
);
grant select on public.design_settings to anon;
grant select, insert, update on public.design_settings to authenticated;
grant all on public.design_settings to service_role;
alter table public.design_settings enable row level security;
create policy "design public read" on public.design_settings for select to anon, authenticated using (true);
create policy "design admin write" on public.design_settings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger design_settings_updated before update on public.design_settings for each row execute function public.update_updated_at_column();

-- ============ media library ============
create table public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null,
  url text not null,
  filename text not null,
  mime_type text,
  width integer,
  height integer,
  size_bytes bigint,
  alt_text text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select on public.media to anon;
grant select, insert, update, delete on public.media to authenticated;
grant all on public.media to service_role;
alter table public.media enable row level security;
create policy "media public read" on public.media for select to anon, authenticated using (true);
create policy "media admin write" on public.media for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ social links ============
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text not null default '',
  handle text,
  url text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);
grant select on public.social_links to anon;
grant select, insert, update, delete on public.social_links to authenticated;
grant all on public.social_links to service_role;
alter table public.social_links enable row level security;
create policy "social public read" on public.social_links for select to anon, authenticated using (is_published);
create policy "social admin write" on public.social_links for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ page sections (homepage / about copy) ============
create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section_key text not null,
  heading text,
  subtitle text,
  description text,
  cta_label text,
  cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  image_url text,
  data jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  updated_at timestamptz not null default now(),
  unique (page, section_key)
);
grant select on public.page_sections to anon;
grant select, insert, update, delete on public.page_sections to authenticated;
grant all on public.page_sections to service_role;
alter table public.page_sections enable row level security;
create policy "sections public read" on public.page_sections for select to anon, authenticated using (status = 'published');
create policy "sections admin write" on public.page_sections for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger page_sections_updated before update on public.page_sections for each row execute function public.update_updated_at_column();

-- ============ about ============
create table public.about_content (
  id text primary key default 'default' check (id = 'default'),
  founder_name text not null default 'Krishnakant Yadav',
  founder_title text not null default 'Founder & Expedition Lead',
  biography text not null default '',
  secondary_identity text not null default '',
  founder_image_url text,
  achievements text[] not null default '{}',
  certifications text[] not null default '{}',
  cta_label text,
  cta_href text,
  updated_at timestamptz not null default now()
);
grant select on public.about_content to anon;
grant select, insert, update on public.about_content to authenticated;
grant all on public.about_content to service_role;
alter table public.about_content enable row level security;
create policy "about public read" on public.about_content for select to anon, authenticated using (true);
create policy "about admin write" on public.about_content for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger about_updated before update on public.about_content for each row execute function public.update_updated_at_column();

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  year text,
  title text not null,
  description text,
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  updated_at timestamptz not null default now()
);
grant select on public.milestones to anon;
grant select, insert, update, delete on public.milestones to authenticated;
grant all on public.milestones to service_role;
alter table public.milestones enable row level security;
create policy "milestones public read" on public.milestones for select to anon, authenticated using (status = 'published');
create policy "milestones admin write" on public.milestones for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ journeys ============
create table public.journeys (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  destination text not null default '',
  title text not null,
  short_description text,
  long_description text,
  duration text,
  price text,
  difficulty text,
  best_season text,
  is_available boolean not null default true,
  highlights text[] not null default '{}',
  itinerary jsonb not null default '[]'::jsonb,
  travel_info text,
  notes text,
  cta_label text,
  booking_url text,
  hero_image_url text,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.journeys to anon;
grant select, insert, update, delete on public.journeys to authenticated;
grant all on public.journeys to service_role;
alter table public.journeys enable row level security;
create policy "journeys public read" on public.journeys for select to anon, authenticated using (status = 'published');
create policy "journeys admin write" on public.journeys for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger journeys_updated before update on public.journeys for each row execute function public.update_updated_at_column();

create table public.journey_images (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  media_id uuid references public.media(id) on delete set null,
  url text not null,
  caption text,
  alt_text text,
  sort_order integer not null default 0
);
grant select on public.journey_images to anon;
grant select, insert, update, delete on public.journey_images to authenticated;
grant all on public.journey_images to service_role;
alter table public.journey_images enable row level security;
create policy "journey images public read" on public.journey_images for select to anon, authenticated using (true);
create policy "journey images admin write" on public.journey_images for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ travel atlas ============
create table public.atlas_regions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  kind text not null default 'state' check (kind in ('state','country')),
  visited boolean not null default false,
  visited_year integer,
  overview text,
  journal text,
  favorite_memory text,
  culture text,
  food text[] not null default '{}',
  tips text[] not null default '{}',
  hidden_gems text[] not null default '{}',
  founder_note text,
  stats jsonb not null default '{}'::jsonb,
  cover_image_url text,
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  updated_at timestamptz not null default now()
);
grant select on public.atlas_regions to anon;
grant select, insert, update, delete on public.atlas_regions to authenticated;
grant all on public.atlas_regions to service_role;
alter table public.atlas_regions enable row level security;
create policy "regions public read" on public.atlas_regions for select to anon, authenticated using (status = 'published');
create policy "regions admin write" on public.atlas_regions for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger regions_updated before update on public.atlas_regions for each row execute function public.update_updated_at_column();

create table public.atlas_destinations (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.atlas_regions(id) on delete cascade,
  name text not null,
  kind text,
  summary text,
  tips text[] not null default '{}',
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  updated_at timestamptz not null default now()
);
grant select on public.atlas_destinations to anon;
grant select, insert, update, delete on public.atlas_destinations to authenticated;
grant all on public.atlas_destinations to service_role;
alter table public.atlas_destinations enable row level security;
create policy "destinations public read" on public.atlas_destinations for select to anon, authenticated using (status = 'published');
create policy "destinations admin write" on public.atlas_destinations for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.atlas_stories (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.atlas_regions(id) on delete cascade,
  destination_id uuid references public.atlas_destinations(id) on delete set null,
  title text not null,
  story_date text,
  narrative text,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  updated_at timestamptz not null default now()
);
grant select on public.atlas_stories to anon;
grant select, insert, update, delete on public.atlas_stories to authenticated;
grant all on public.atlas_stories to service_role;
alter table public.atlas_stories enable row level security;
create policy "stories public read" on public.atlas_stories for select to anon, authenticated using (status = 'published');
create policy "stories admin write" on public.atlas_stories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ gallery ============
create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  media_id uuid references public.media(id) on delete set null,
  url text not null,
  caption text,
  alt_text text,
  location text,
  album text,
  region_id uuid references public.atlas_regions(id) on delete set null,
  destination_id uuid references public.atlas_destinations(id) on delete set null,
  journey_id uuid references public.journeys(id) on delete set null,
  sort_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.gallery_images to anon;
grant select, insert, update, delete on public.gallery_images to authenticated;
grant all on public.gallery_images to service_role;
alter table public.gallery_images enable row level security;
create policy "gallery public read" on public.gallery_images for select to anon, authenticated using (status = 'published');
create policy "gallery admin write" on public.gallery_images for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger gallery_updated before update on public.gallery_images for each row execute function public.update_updated_at_column();

-- ============ testimonials ============
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  review text not null,
  avatar_url text,
  trip text,
  review_date text,
  rating integer check (rating between 1 and 5),
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  updated_at timestamptz not null default now()
);
grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "testimonials public read" on public.testimonials for select to anon, authenticated using (status = 'published');
create policy "testimonials admin write" on public.testimonials for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ============ audit log ============
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  actor_email text,
  entity text not null,
  entity_id text,
  action text not null,
  summary text,
  created_at timestamptz not null default now()
);
grant select, insert on public.audit_log to authenticated;
grant all on public.audit_log to service_role;
alter table public.audit_log enable row level security;
create policy "audit admin read" on public.audit_log for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "audit admin insert" on public.audit_log for insert to authenticated with check (public.has_role(auth.uid(),'admin'));

-- ============ storage policies (bucket: media) ============
create policy "media admin list" on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));

-- ============ seed existing content ============
insert into public.site_settings (id, site_description, seo_title, seo_description, keywords, footer_copyright, contact_email, contact_phone)
values ('default',
 'Founder-led expeditions across India''s most breathtaking destinations—crafted with trust, community, and unforgettable experiences.',
 'The Wandering Nomads — By KRISH',
 'Founder-led expeditions across India''s most breathtaking destinations—crafted with trust, community, and unforgettable experiences.',
 'travel, india, himalaya, expeditions, treks, founder-led travel',
 '© The Wandering Nomads. All rights reserved.',
 'hello@thewanderingnomads.in', '+91 96212 1733');

insert into public.design_settings (id) values ('default');
insert into public.about_content (id, biography, secondary_identity)
values ('default',
 'Krish has spent the last decade following mountain light across the subcontinent — 24 states, three countries, and a community that keeps coming back.',
 'Cybersecurity & ethical hacking professional.');

insert into public.social_links (platform, label, handle, url, sort_order) values
 ('instagram','Instagram — Founder','@wanderwithkrishh','https://instagram.com/wanderwithkrishh',1),
 ('instagram','Instagram — The Wandering Nomads','@thewanderingnomads.in','https://instagram.com/thewanderingnomads.in',2),
 ('whatsapp','WhatsApp',null,'https://wa.me/91962121733',3),
 ('youtube','YouTube',null,'https://youtube.com/@thewanderingnomads',4),
 ('email','Email',null,'mailto:hello@thewanderingnomads.in',5);

insert into public.page_sections (page, section_key, heading, subtitle, description, cta_label, cta_href, secondary_cta_label, secondary_cta_href, sort_order) values
 ('home','hero','Wander far. Come back changed.','The Wandering Nomads · By KRISH','Founder-led expeditions across India''s most breathtaking landscapes — small groups, honest storytelling, and a community built on trust.','See upcoming trips','/upcoming-trips','Explore India trips','/india-trips',1),
 ('home','founder','The founder''s trail','Story','From a first solo bus to Manali to 24 states explored — every expedition is designed from lived experience.',null,null,null,null,2),
 ('home','journeys','Featured journeys','Expeditions','Handpicked routes, led personally, capped at small group sizes.','View all journeys','/journeys',null,null,3),
 ('home','atlas','The Travel Atlas','Map','A living map of every state and country explored, with photographs and field notes.','Explore Atlas Map','/atlas',null,null,4),
 ('home','gallery','Field notes','Gallery','Photographs from the road — mountains, monasteries, and the people in between.','See the gallery','/gallery',null,null,5),
 ('home','testimonials','Travellers'' words','Trust','What people say after travelling with us.',null,null,null,null,6),
 ('home','contact','Let''s plan your next expedition','Contact','Tell us where you want to go and we''ll build the route around you.','Message on WhatsApp',null,null,null,7),
 ('about','intro','A decade on the road','About','Krish''s story, the milestones, and why The Wandering Nomads exists.',null,null,null,null,1);

insert into public.milestones (year, title, description, sort_order) values
 ('2016','First solo journey','A bus to Manali that turned into a decade of wandering.',1),
 ('2019','First group expedition','Five strangers, one Himalayan route, a community begins.',2),
 ('2023','24 states explored','India, Nepal and Bhutan — mapped on foot.',3),
 ('2026','The Wandering Nomads','Founder-led expeditions, built on trust.',4);

insert into public.journeys (slug, destination, title, short_description, duration, difficulty, best_season, highlights, status, sort_order) values
 ('kashmir-great-lakes','Kashmir','Kashmir Great Lakes','Seven alpine lakes across meadows and passes in the Kashmir Himalaya.','7 days','Moderate','July – September','{"Vishansar & Krishansar lakes","Gadsar Pass","Shepherd trails"}','published',1),
 ('spiti-valley','Spiti','Spiti Valley Expedition','High-desert monasteries, cold nights and the bluest skies in India.','8 days','Moderate','June – September','{"Key Monastery","Chandratal","Hikkim post office"}','published',2),
 ('rishikesh-retreat','Rishikesh','Rishikesh River Retreat','Ganga mornings, river camps and slow travel in the foothills.','4 days','Easy','October – March','{"River camping","Waterfall trek","Evening aarti"}','published',3);

insert into public.atlas_regions (code, name, kind, visited, sort_order) values
 ('HP','Himachal Pradesh','state',true,1),('UK','Uttarakhand','state',true,2),
 ('JK','Jammu & Kashmir','state',true,3),('PB','Punjab','state',true,4),
 ('HR','Haryana','state',true,5),('DL','Delhi','state',true,6),
 ('RJ','Rajasthan','state',true,7),('GJ','Gujarat','state',true,8),
 ('MH','Maharashtra','state',true,9),('GA','Goa','state',true,10),
 ('KA','Karnataka','state',true,11),('KL','Kerala','state',true,12),
 ('TN','Tamil Nadu','state',true,13),('AP','Andhra Pradesh','state',true,14),
 ('TG','Telangana','state',true,15),('MP','Madhya Pradesh','state',true,16),
 ('UP','Uttar Pradesh','state',true,17),('BR','Bihar','state',true,18),
 ('WB','West Bengal','state',true,19),('OR','Odisha','state',true,20),
 ('SK','Sikkim','state',true,21),('AS','Assam','state',true,22),
 ('ML','Meghalaya','state',true,23),('AR','Arunachal Pradesh','state',true,24),
 ('NP','Nepal','country',true,25),('BT','Bhutan','country',true,26);