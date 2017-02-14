<?php

@move_uploaded_file($_FILES['ufile']['tmp_name'][0],
        'uploads/'.$_FILES['ufile']['name'][0]);
@move_uploaded_file($_FILES['ufile']['tmp_name'][1],
        'uploads/'.$_FILES['ufile']['name'][1]);
@move_uploaded_file($_FILES['ufile']['tmp_name'][2],
        'uploads/'.$_FILES['ufile']['name'][2]);

echo '{"success":true}';

?>
