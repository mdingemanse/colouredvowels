# WARNING: Protect this folder

.htaccess example
```
AuthUserFile /your/path/to/.htpasswd
AuthType Basic
AuthName "Admin Panel"
Require valid-user

RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php
```


