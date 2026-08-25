-- ============================================================================
-- Pre-launch content refresh (25 Aug 2026)
--
-- 1. WhatsApp/phone → the new number (+91 96212 1733) in CMS-managed contact
--    fields (footer, floating button, social links read these).
-- 2. Homepage hero CTAs → trips-focused (replaces the old "Explore Journeys" /
--    "Explore Atlas Map" labels).
-- 3. Trip inventory → the real upcoming/ongoing departures:
--      10–15 Sep   Chandratal + Manali + Kasol   (confirmed)
--      25–30 Sep   Valley of Flowers             (launch)
--      16–20 Oct   Meghalaya                     (launch)
--      early Nov   Diwali-period product (TBC)   (conditional, kept as draft)
--      23–25 Nov   Dev Deepawali — Varanasi      (confirmed)
--    The legacy demo journeys are demoted to drafts, kept for reference, so
--    published listings render exactly the new inventory.
-- ============================================================================

-- ============ 1. contact number ============
update public.site_settings
set contact_phone = '+91 96212 1733'
where id = 'default';

update public.social_links
set url = 'https://wa.me/91962121733'
where platform = 'whatsapp';

-- ============ 2. homepage hero CTAs ============
update public.page_sections
set cta_label = 'See upcoming trips',
    cta_href = '/upcoming-trips',
    secondary_cta_label = 'Explore India trips',
    secondary_cta_href = '/india-trips'
where page = 'home' and section_key = 'hero';

-- ============ 3. journeys ============
-- demote the original demo journeys (keep rows for reference)
update public.journeys
set status = 'draft'
where slug in ('kashmir-great-lakes', 'spiti-valley', 'rishikesh-retreat');

insert into public.journeys
  (id, slug, destination, title, short_description, long_description, duration, price,
   difficulty, best_season, is_available, highlights, itinerary, travel_info, notes,
   cta_label, booking_url, hero_image_url, status, sort_order)
values
  ('aa100000-0000-4000-8000-000000000001',
   'chandratal-manali-kasol',
   'Himachal Pradesh',
   'Chandratal · Manali · Kasol',
   'Manali''s cedar air, a star-lit night beside the Chandratal moon lake, and slow evenings by the Parvati in Kasol.',
   'A 6-day Himachal loop that doesn''t rush: two easy days around Manali''s cafés and pine ridges, a night beside Chandratal''s still water under a sky full of stars, and a decompression finish in Kasol. Small group, confirmed batch, every day hosted.',
   '6 days',
   null,
   'Moderate',
   'Sep — Oct',
   true,
   '{"Chandratal moon lake (4,300 m)","Old Manali & its cafés","Parvati valley evenings in Kasol","Confirmed departure — 10 to 15 Sep"}',
   '[{"day":1,"title":"Arrive Manali","description":"Meet the host, old-town walk, early night."},
     {"day":2,"title":"Manali, unhurried","description":"Jogini falls or a pine-ridge walk, café evening."},
     {"day":3,"title":"The road to Chandratal","description":"A long, beautiful drive. Camp beside the lake."},
     {"day":4,"title":"Moon lake morning","description":"Sunrise at Chandratal, slow return toward Manali."},
     {"day":5,"title":"Kasol","description":"Parvati river, village walk, café time."},
     {"day":6,"title":"Depart","description":"Drop at Bhuntar. WhatsApp group stays open."}]'::jsonb,
   'Reach Manali by overnight Volvo from Delhi/Chandigarh or fly into Bhuntar (KUU). We coordinate pickups in Manali on Day 1.',
   'Chandratal sits at 4,300 m — Day 4 stays flexible for acclimatisation and road weather.',
   null, null, null,
   'published', 1),

  ('aa100000-0000-4000-8000-000000000002',
   'valley-of-flowers',
   'Valley of Flowers',
   'Valley of Flowers Trek',
   'An alpine meadow that bursts into colour for only a few weeks a year.',
   'A trek into the Nanda Devi biosphere — Govindghat to Ghangaria, a full day in the valley, and Hemkund Sahib if the group wants the extra climb.',
   '6 days',
   null,
   'Moderate',
   'Jul — Sep',
   true,
   '{"Peak bloom window","Ghangaria base","Optional Hemkund Sahib","Launch batch — 25 to 30 Sep"}',
   '[{"day":1,"title":"Assemble","description":"Haridwar or Govindghat — confirmed on booking."},
     {"day":2,"title":"Trek to Ghangaria","description":"The base for the valley. Early night."},
     {"day":3,"title":"Valley of Flowers","description":"A full day in the meadow. Peak bloom window."},
     {"day":4,"title":"Hemkund optional","description":"The extra climb if the group wants it."},
     {"day":5,"title":"Walk out","description":"Back to the road, weather permitting."},
     {"day":6,"title":"Depart","description":"Drop at the assembly point."}]'::jsonb,
   'Assemble at Haridwar or Govindghat — confirmed on booking.',
   'Permits and mountain weather can reshape a day. We plan slack into the itinerary.',
   null, null, null,
   'published', 2),

  ('aa100000-0000-4000-8000-000000000003',
   'meghalaya',
   'Meghalaya',
   'Meghalaya — Cloud Country',
   'Living-root bridges, waterfalls after rain, and Dawki''s glass-clear river.',
   'Five days in the abode of clouds — Shillong''s cafés, the root bridges and blue pools of Sohra, and a slow morning on the Umngot at Dawki. A launch batch, hosted personally, kept deliberately small.',
   '5 days',
   null,
   'Moderate',
   'Oct — Apr',
   true,
   '{"Double-decker root bridge trek","Dawki (Umngot) river morning","Sohra waterfalls & blue pools","Launch batch — 16 to 20 Oct"}',
   '[{"day":1,"title":"Shillong","description":"Meet the host, cafés, an easy evening."},
     {"day":2,"title":"Sohra (Cherrapunji)","description":"Waterfalls, caves, and the first blue pools."},
     {"day":3,"title":"Root bridge trek","description":"The double-decker bridge — steps down, smiles up."},
     {"day":4,"title":"Dawki","description":"Glass-clear river, boats, border market."},
     {"day":5,"title":"Depart","description":"Return to Shillong / Guwahati."}]'::jsonb,
   'Fly into Shillong (SHL) or Guwahati (GAU); we coordinate the Shillong pickup.',
   'The root-bridge descent has ~3,500 steps. Take it slow — we do.',
   null, null, null,
   'published', 3),

  ('aa100000-0000-4000-8000-000000000004',
   'dev-deepawali-varanasi',
   'Varanasi',
   'Dev Deepawali — Varanasi',
   'A million lamps on the ghats, a boat on the Ganges, and three days inside the oldest living city.',
   'Dev Deepawali is the night the ghats of Varanasi light end to end. Three hosted days — dawn boat rides, the old city''s lanes and kitchens, and the festival evening watched from the river itself.',
   '3 days',
   null,
   'Easy',
   'Nov',
   true,
   '{"Dev Deepawali evening on the ghats","Sunrise boat ride on the Ganges","Old-city food walk","Confirmed — 23 to 25 Nov"}',
   '[{"day":1,"title":"Arrive Varanasi","description":"Ghat walk, evening aarti from the river."},
     {"day":2,"title":"Old city","description":"Sunrise boat ride, lanes, kachori and chai."},
     {"day":3,"title":"Dev Deepawali","description":"The festival of lamps. Evening boat, late checkout next morning."}]'::jsonb,
   'Reach Varanasi by train (BSB) or flight (VNS); we meet you at the ghats on Day 1.',
   'Festival crowds are part of the experience — the group stays together with the host.',
   null, null, null,
   'published', 4),

  -- Diwali-period product, destination TBD: kept as a draft so the owner can
  -- finish it in the Studio and publish when confirmed (conditional).
  ('aa100000-0000-4000-8000-000000000005',
   'diwali-special',
   'To be announced',
   'Diwali Special — Destination TBA',
   'An early-November departure over the Diwali window. Destination and route are being finalised.',
   'An early-November departure over the Diwali window. Destination and route are being finalised — publish this trip from the Studio once the plan is confirmed.',
   '3 days',
   null,
   'Easy',
   'Nov',
   true,
   '{"Diwali window departure","Small group","Route announced soon","Conditional — early Nov"}',
   '[]'::jsonb,
   null,
   'Draft trip — publish from the Studio once the destination is confirmed.',
   null, null, null,
   'draft', 5)

on conflict (slug) do update set
  destination = excluded.destination,
  title = excluded.title,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  duration = excluded.duration,
  difficulty = excluded.difficulty,
  best_season = excluded.best_season,
  is_available = excluded.is_available,
  highlights = excluded.highlights,
  itinerary = excluded.itinerary,
  travel_info = excluded.travel_info,
  notes = excluded.notes,
  status = excluded.status,
  sort_order = excluded.sort_order;

-- ============ departures (batches) ============
insert into public.trip_batches
  (id, trip_id, start_date, end_date, capacity, seats_remaining, batch_type, status, sort_order)
values
  ('bb100000-0000-4000-8000-000000000001',
   (select id from public.journeys where slug = 'chandratal-manali-kasol'),
   '2026-09-10', '2026-09-15', null, null, 'Confirmed', 'published', 1),
  ('bb100000-0000-4000-8000-000000000002',
   (select id from public.journeys where slug = 'valley-of-flowers'),
   '2026-09-25', '2026-09-30', null, null, 'Launch', 'published', 2),
  ('bb100000-0000-4000-8000-000000000003',
   (select id from public.journeys where slug = 'meghalaya'),
   '2026-10-16', '2026-10-20', null, null, 'Launch', 'published', 3),
  ('bb100000-0000-4000-8000-000000000004',
   (select id from public.journeys where slug = 'dev-deepawali-varanasi'),
   '2026-11-23', '2026-11-25', null, null, 'Confirmed', 'published', 4),
  ('bb100000-0000-4000-8000-000000000005',
   (select id from public.journeys where slug = 'diwali-special'),
   '2026-11-07', '2026-11-09', null, null, 'Conditional', 'draft', 5)
on conflict (id) do nothing;

-- ============ lead host: Krish on every published batch ============
insert into public.trip_batch_hosts (id, batch_id, host_id, role)
select 'cc100000-0000-4000-8000-00000000000' || g.n, b.id, h.id, 'lead'
from public.hosts h,
     public.trip_batches b,
     generate_series(1, 5) as g(n)
where h.slug = 'krish'
  and b.id = ('bb100000-0000-4000-8000-00000000000' || g.n)::uuid
on conflict (batch_id, host_id, role) do nothing;
