-- Dumping data for table `categories`
INSERT INTO `categories` (`id`, `category_name`) VALUES
(1, 'Taxation'),
(2, 'Audit'),
(3, 'Accounting'),
(4, 'Financial Advisory');

-- Dumping data for table `posts`
INSERT INTO `posts` (`id`, `category_id`, `title`, `post`, `image`, `created_user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 'Understanding GST in 2026', '<p>GST has evolved significantly...</p>', 'uploads/static/bg1.jpg', 6, NOW(), NOW()),
(2, 2, 'Best Practices for Internal Audit', '<p>Internal auditing is a key part...</p>', 'uploads/static/bg1.jpg', 6, NOW(), NOW()),
(3, 3, 'Tax Saving Strategies for Small Businesses', '<p>Small businesses can save more tax by...</p>', 'uploads/static/bg1.jpg', 6, NOW(), NOW());
