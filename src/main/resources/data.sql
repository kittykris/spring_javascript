insert into roles values (1, 'ROLE_USER'), (2, 'ROLE_ADMIN');
insert into users value (1, 'user', 'user', 'user', 'user', '$2a$12$tGcGBruw0ZKUXR0eR3tne.SgcgBWGItop9mMUkRRlcrz4ZgPnUJwW', 'user');
#password "user"
insert into users value (2, 'admin', 'admin', 'admin', 'admin', '$2a$12$e0bnifSFgKfR9Ny99jHzpuj1DJBOV9wNgoRA0U4dMwqn/DyQkTjdu', 'admin');
#password "admin"
insert into users value (3, 'user1', 'user1', 'user1', 'user1', '$2a$12$hqkkSE5gdq0P3R5kN4hy9ebk/Ut65e3uMv8ttiOe2efEptOWGMlVa', 'user1');
#password "user1"
insert into users_roles values (1, 1), (2, 2), (3, 1), (3, 2), (2, 1);