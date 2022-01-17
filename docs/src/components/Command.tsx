import styles from './Command.module.sass';

import { FC, useState } from 'react';
import { Badge, Button, Col, Collapse } from 'react-bootstrap';

import { capitalize } from '@src/utils';

import { ApplicationCommand } from '@bot/models/command';

const Command: FC<{ command: ApplicationCommand }> = ({ command }) => {
	const [open, setOpen] = useState(false);

	return (
		<Col md={4}>
			<div className={styles.command}>
				<h3>{capitalize(command.name)}</h3>
				<h6>{command.description}</h6>
				{command.options && (
					<>
						<Button className={styles.collapseButton} onClick={() => setOpen(!open)}>
							Options
						</Button>
						<Collapse in={open}>
							<div className={styles.options}>
								{command.options.map((option) => (
									<div key={option.name}>
										<h5>
											<Badge className={styles.optionBadge} bg="secondary">
												{option.required ? 'Required' : 'Optional'}
											</Badge>
											{capitalize(option.name)}:
										</h5>
										<h6>{option.description}</h6>
									</div>
								))}
							</div>
						</Collapse>
					</>
				)}
			</div>
		</Col>
	);
};

export default Command;
