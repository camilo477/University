# Generated by Django 5.1.1 on 2024-10-25 14:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0004_courseregistration_remove_subject_professor_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CourseRegistration',
        ),
    ]
