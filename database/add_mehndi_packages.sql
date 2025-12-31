INSERT INTO public.website_settings (setting_key, setting_value)
VALUES (
  'mehndi_packages',
  '[
    {
      "id": 1,
      "name": "Bridal Package",
      "price": 5000,
      "features": [
        "Full hands (front & back) up to elbows",
        "Feet up to ankles",
        "Intricate bridal figures",
        "Premium organic henna",
        "Dark stain guarantee"
      ],
      "duration": "4-6 Hours"
    },
    {
      "id": 2,
      "name": "Party Guest Package",
      "price": 500,
      "features": [
        "Per hand (one side)",
        "Simple arabic/indian designs",
        "Premium organic henna",
        "Quick application (15-20 mins)"
      ],
      "duration": "15-20 Mins"
    },
    {
      "id": 3,
      "name": "Engagement Special",
      "price": 2500,
      "features": [
        "Both hands up to wrists",
        "Intricate geometric patterns",
        "Couple initials inclusion",
        "Premium organic henna"
      ],
      "duration": "2-3 Hours"
    }
  ]'
)
ON CONFLICT (setting_key) DO NOTHING;
