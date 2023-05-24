INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

DELETE FROM account WHERE account_id = 1;

-- 

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interiors')
WHERE inv_id = 10;

SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN classification 
ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';





